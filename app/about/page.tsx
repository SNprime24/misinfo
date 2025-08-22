import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Target, Users, Zap } from "lucide-react"

export default function About() {
  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-in fade-in-0 duration-1000">
            <Badge variant="secondary" className="mb-4">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Empowering Better Writing Through Technology
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              TextAnalyzer was created to bridge the gap between complex linguistic analysis and practical writing
              improvement, making advanced text analysis accessible to everyone.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-12 animate-in fade-in-0 duration-1000 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="w-6 h-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We believe that clear, effective communication is fundamental to education and professional success. Our
                mission is to democratize access to advanced text analysis tools, helping writers of all levels improve
                their content quality and readability.
              </p>
              <p className="text-muted-foreground">
                Whether you're a student working on an essay, an educator creating course materials, or a professional
                crafting important communications, TextAnalyzer provides the insights you need to write with confidence.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="animate-in fade-in-0 duration-1000 delay-300">
              <CardContent className="pt-6">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Educational Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  We're committed to supporting educational goals with tools specifically designed for academic and
                  instructional content analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-0 duration-1000 delay-400">
              <CardContent className="pt-6">
                <div className="p-3 bg-secondary/10 rounded-full w-fit mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Accessibility First</h3>
                <p className="text-sm text-muted-foreground">
                  Our tools are designed to be intuitive and accessible to users of all technical backgrounds and
                  writing experience levels.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-0 duration-1000 delay-500">
              <CardContent className="pt-6">
                <div className="p-3 bg-accent/10 rounded-full w-fit mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We continuously improve our analysis algorithms and user experience based on the latest research in
                  computational linguistics and user feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-0 duration-1000 delay-600">
              <CardContent className="pt-6">
                <div className="p-3 bg-chart-1/10 rounded-full w-fit mb-4">
                  <Target className="w-6 h-6 text-chart-1" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">
                  We respect your privacy. Your text is processed securely and never stored permanently on our servers.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technology Section */}
          <Card className="animate-in fade-in-0 duration-1000 delay-700">
            <CardHeader>
              <CardTitle className="text-2xl">The Technology Behind TextAnalyzer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                TextAnalyzer combines multiple advanced natural language processing techniques to provide comprehensive
                text analysis:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Readability Analysis:</strong> Using established metrics like Flesch-Kincaid and custom
                    algorithms
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Sentiment Analysis:</strong> Advanced machine learning models for emotional tone detection
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Topic Extraction:</strong> Intelligent keyword and theme identification
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-chart-1 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Grammar & Style:</strong> Comprehensive linguistic pattern analysis
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
