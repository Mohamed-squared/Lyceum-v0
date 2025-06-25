-- Supabase Storage Policies for 'user-assets' bucket

-- 1. Policy for public SELECT access
CREATE POLICY "Public read access for user assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'user-assets' );

-- 2. Policy for INSERT access (authenticated user upload to their own folder)
-- Path is expected to be 'user-assets/<user_id>/<file_name>'
-- (storage.foldername(name))[1] should extract '<user_id>'
CREATE POLICY "Allow authenticated user uploads to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Auth Refactor: Function and Trigger for new user profile creation

-- 1. Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- 2. Create the trigger to call the function on new user sign-up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Marketplace Feature SQL

-- 1. Create Enums for Marketplace
CREATE TYPE public.marketplace_category_enum AS ENUM ('theme', 'badge', 'boost');
CREATE TYPE public.marketplace_rarity_enum AS ENUM ('common', 'rare', 'epic', 'legendary');

-- 2. Create marketplace_items table
CREATE TABLE public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
  category public.marketplace_category_enum NOT NULL,
  rarity public.marketplace_rarity_enum NOT NULL,
  image_url TEXT,
  data JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_marketplace_items_category ON public.marketplace_items(category);
CREATE INDEX idx_marketplace_items_rarity ON public.marketplace_items(rarity);
CREATE INDEX idx_marketplace_items_is_active ON public.marketplace_items(is_active);

-- Trigger for updated_at timestamp on marketplace_items
CREATE TRIGGER update_marketplace_items_updated_at
BEFORE UPDATE ON public.marketplace_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); -- Assumes update_updated_at_column function exists from 001_initial_schema.sql

-- 3. Create user_inventory table
CREATE TABLE public.user_inventory (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE RESTRICT, -- Prevent item deletion if owned
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  data JSONB, -- For any instance-specific data, like quantity or activation status of a boost
  UNIQUE (user_id, item_id)
);
CREATE INDEX idx_user_inventory_user_id ON public.user_inventory(user_id);
CREATE INDEX idx_user_inventory_item_id ON public.user_inventory(item_id);

-- 4. Enable RLS for marketplace tables
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for marketplace_items
-- Allow public read access to active items
CREATE POLICY "Allow public read access to active marketplace items"
ON public.marketplace_items FOR SELECT
USING (is_active = TRUE);

-- Allow admin full access (replace 'admin_role_name' with your actual admin role if different)
-- This assumes an admin role check. If using user IDs, adjust accordingly.
-- For simplicity, we might rely on service_key for admin operations or specific admin user policies.
-- For now, let's assume admin operations are done with service_role key or specific function.
-- A more robust policy would check user's role from 'profiles' table if admin actions via API are needed for specific users.

-- 6. RLS Policies for user_inventory
-- Users can select their own inventory items
CREATE POLICY "Users can view their own inventory"
ON public.user_inventory FOR SELECT
USING (auth.uid() = user_id);

-- Users cannot directly insert/update/delete their inventory; this will be handled by RPC function.
-- To allow RPC to modify, it will be SECURITY DEFINER or use service role.

-- Placeholder for Admin access policies if needed directly on tables
-- CREATE POLICY "Admin full access on marketplace_items" ON public.marketplace_items FOR ALL USING (get_my_claim('user_role') = '"admin"'); -- Example
-- CREATE POLICY "Admin full access on user_inventory" ON public.user_inventory FOR ALL USING (get_my_claim('user_role') = '"admin"'); -- Example


-- Ensure the updated_at trigger function exists (it's in 001_initial_schema.sql but good to be mindful)
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- 7. RPC Function for purchasing a marketplace item
CREATE OR REPLACE FUNCTION public.purchase_marketplace_item(item_id_input UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  item_price INT;
  user_credits_val INT;
  item_exists BOOLEAN;
  already_owned BOOLEAN;
BEGIN
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not authenticated.');
  END IF;

  -- Check if item exists and get its price
  SELECT price INTO item_price FROM public.marketplace_items WHERE id = item_id_input AND is_active = TRUE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Item not found or is not active.');
  END IF;

  -- Check if user already owns the item
  SELECT EXISTS (
    SELECT 1 FROM public.user_inventory WHERE user_id = current_user_id AND item_id = item_id_input
  ) INTO already_owned;
  IF already_owned THEN
    RETURN jsonb_build_object('success', false, 'message', 'You already own this item.');
  END IF;

  -- Check user's current credits
  SELECT credits INTO user_credits_val FROM public.profiles WHERE id = current_user_id;
  IF user_credits_val IS NULL THEN
     -- This case should ideally not happen if profiles are created correctly for all users.
    RETURN jsonb_build_object('success', false, 'message', 'User profile not found or credits missing.');
  END IF;

  IF user_credits_val < item_price THEN
    RETURN jsonb_build_object('success', false, 'message', 'Insufficient credits.');
  END IF;

  -- Perform the transaction: Deduct credits and add to inventory
  UPDATE public.profiles
  SET credits = credits - item_price
  WHERE id = current_user_id;

  INSERT INTO public.user_inventory (user_id, item_id)
  VALUES (current_user_id, item_id_input);

  RETURN jsonb_build_object('success', true, 'message', 'Purchase successful!');

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error internally if needed (e.g. RAISE LOG 'Error in purchase_marketplace_item: %', SQLERRM;)
    RETURN jsonb_build_object('success', false, 'message', 'An error occurred during the transaction: ' || SQLERRM);
END;
$$;
