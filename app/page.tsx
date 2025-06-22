import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Trophy, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Welcome to <span className="text-primary">Lyceum</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            The AI-powered collaborative learning platform where knowledge meets innovation. Create comprehensive
            courses, connect with study partners, and learn with personalized AI tutoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>AI Course Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload textbooks or lectures and let AI generate comprehensive courses with notes, quizzes, and
                presentations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Study Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with fellow learners, track progress together, and engage in friendly academic challenges.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Gamification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn credits, compete in challenges, and climb leaderboards while mastering your subjects.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Personalized Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI tutoring that adapts to your learning style and focuses on your areas of improvement.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,000+</div>
              <div className="text-muted-foreground">Courses Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <div className="text-muted-foreground">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Ready to Transform Your Learning?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of learners who are already experiencing the future of education with Lyceum.
          </p>
          <Button asChild size="lg">
            <Link href="/auth">
              Start Learning Today <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
