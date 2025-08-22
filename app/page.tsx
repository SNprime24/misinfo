import { AnalysisInterface } from "@/components/analysis-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Target, Lightbulb, BarChart3, ArrowRight, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-in fade-in-0 duration-1000">
            <Badge variant="secondary" className="mb-4">
              AI-Powered Analysis
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Analyze Your Text Like Never Before
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Get comprehensive insights into your writing with our advanced text analysis tool. Improve readability,
              enhance educational content, and perfect your communication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="group">
                Start Analyzing
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/how-it-works">Learn How it Works</Link>
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-in fade-in-0 duration-1000 delay-300">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Comprehensive Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed insights into readability, sentiment, grammar, and vocabulary diversity.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Educational Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Specialized analysis for educational content with actionable improvement suggestions.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Lightbulb className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Smart Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  Receive personalized recommendations to enhance your writing quality and clarity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analysis Interface */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <AnalysisInterface />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose TextAnalyzer?</h2>
              <p className="text-lg text-muted-foreground">
                Trusted by educators, students, and professionals worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full mt-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Instant Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Get comprehensive analysis results in seconds, not minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full mt-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Educational Focus</h4>
                    <p className="text-sm text-muted-foreground">
                      Specifically designed for educational content and academic writing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full mt-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Privacy First</h4>
                    <p className="text-sm text-muted-foreground">
                      Your text is processed securely and never stored permanently.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/10 rounded-full mt-1">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Mobile Friendly</h4>
                    <p className="text-sm text-muted-foreground">
                      Fully responsive design that works perfectly on all devices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/10 rounded-full mt-1">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Actionable Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Not just analysis - get specific suggestions for improvement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/10 rounded-full mt-1">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Free to Use</h4>
                    <p className="text-sm text-muted-foreground">
                      No registration required. Start analyzing your text immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
