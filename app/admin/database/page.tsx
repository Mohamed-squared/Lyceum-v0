import { AlertTriangle } from "lucide-react"

export default function DatabasePage() {
  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Danger Banner */}
      <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold text-destructive">DANGER: Database Access</h2>
        </div>
        <p className="text-destructive mt-2">
          Direct database access. Read-only mode. Any modifications could break the system.
        </p>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Database Browser</h1>
        <p className="text-muted-foreground mt-2">Read-only database table viewer</p>
      </div>
      {/* Rest of the content with theme variables */}
    </div>
  )
}
