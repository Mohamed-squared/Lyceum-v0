-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  major TEXT,
  study_level TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'educator', 'admin', 'primary-admin')),
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'contributor', 'premium')),
  credits INTEGER DEFAULT 0,
  language_preferences JSONB DEFAULT '{}',
  studied_subjects TEXT[],
  interested_majors TEXT[],
  hobbies TEXT[],
  social_profiles JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  language TEXT NOT NULL,
  subject TEXT,
  difficulty_level TEXT,
  status TEXT DEFAULT 'generating' CHECK (status IN ('generating', 'active', 'pending_review', 'archived')),
  privacy TEXT DEFAULT 'private' CHECK (privacy IN ('public', 'private')),
  pricing TEXT DEFAULT 'free' CHECK (pricing IN ('free', 'paid')),
  price DECIMAL(10,2) DEFAULT 0,
  automation_method TEXT CHECK (automation_method IN ('ai', 'manual')),
  generation_progress JSONB DEFAULT '{}',
  textbook_url TEXT,
  lectures_url TEXT,
  first_page_number INTEGER,
  total_chapters INTEGER DEFAULT 0,
  estimated_duration TEXT,
  enrolled_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE enrollments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  mode TEXT DEFAULT 'full' CHECK (mode IN ('full', 'viewer')),
  pace TEXT DEFAULT 'mediocre' CHECK (pace IN ('compact', 'mediocre', 'lenient', 'custom')),
  custom_days INTEGER,
  progress DECIMAL(5,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Create chapters table
CREATE TABLE chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  chapter_number INTEGER NOT NULL,
  content JSONB DEFAULT '{}',
  notes TEXT,
  summary TEXT,
  formulas JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, chapter_number)
);

-- Create assessment_attempts table
CREATE TABLE assessment_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('TestGen', 'Skip Exam', 'Weekly Exam', 'Daily Assignment', 'Midcourse Exam', 'Final Exam')),
  title TEXT,
  chapters TEXT[],
  total_questions INTEGER,
  score DECIMAL(5,2),
  max_score DECIMAL(5,2) DEFAULT 100,
  percentage DECIMAL(5,2),
  duration_minutes INTEGER,
  status TEXT DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'abandoned')),
  answers JSONB DEFAULT '{}',
  questions JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_1_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_partners table
CREATE TABLE study_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, partner_id)
);

-- Create challenges table
CREATE TABLE challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  opponent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  creator_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_courses_creator_id ON courses(creator_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_privacy ON courses(privacy);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_chapters_course_id ON chapters(course_id);
CREATE INDEX idx_assessment_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX idx_assessment_attempts_course_id ON assessment_attempts(course_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can view all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses: Public courses viewable by all, private courses by enrolled users
CREATE POLICY "Public courses are viewable by everyone" ON courses
  FOR SELECT USING (privacy = 'public' OR creator_id = auth.uid());

CREATE POLICY "Users can create courses" ON courses
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own courses" ON courses
  FOR UPDATE USING (auth.uid() = creator_id);

-- Enrollments: Users can view their own enrollments
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enrollments" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Assessment attempts: Users can view and create their own attempts
CREATE POLICY "Users can view own assessment attempts" ON assessment_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessment attempts" ON assessment_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessment attempts" ON assessment_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- Messages: Users can view messages in conversations they're part of
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
