import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload, Cpu, BarChart3, Lightbulb, ArrowRight, CheckCircle } from "lucide-react"

export default function HowItWorks() {
  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-in fade-in-0 duration-1000">
            <Badge variant="secondary" className="mb-4">
              How It Works
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Simple Process, Powerful Results</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our advanced text analysis happens in four simple steps, delivering comprehensive insights in seconds.
            </p>
          </div>

          {/* Process Steps */}
          <div className="space-y-8 mb-16">
            <Card className="relative overflow-hidden animate-in fade-in-0 duration-1000 delay-200">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50"></div>
              <CardContent className="pt-6 pl-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Step 1
                      </Badge>
                      <h3 className="font-semibold text-lg">Input Your Text</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Simply paste or type your text into our analysis interface. We support content of any length, from
                      short paragraphs to full articles and essays.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Essays
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Articles
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Reports
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Educational Content
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden animate-in fade-in-0 duration-1000 delay-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-secondary to-secondary/50"></div>
              <CardContent className="pt-6 pl-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Cpu className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Step 2
                      </Badge>
                      <h3 className="font-semibold text-lg">AI Processing</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Our advanced natural language processing algorithms analyze your text across multiple dimensions
                      including readability, sentiment, grammar, and vocabulary.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Readability scoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Sentiment analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Topic extraction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Grammar checking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden animate-in fade-in-0 duration-1000 delay-400">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent to-accent/50"></div>
              <CardContent className="pt-6 pl-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <BarChart3 className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Step 3
                      </Badge>
                      <h3 className="font-semibold text-lg">Comprehensive Analysis</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      View detailed results organized into intuitive categories. Our analysis covers everything from
                      basic statistics to advanced linguistic patterns.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>
                          <strong>Overview:</strong> Key metrics and statistics
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>
                          <strong>Readability:</strong> Accessibility and comprehension scores
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>
                          <strong>Quality:</strong> Grammar and vocabulary assessment
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden animate-in fade-in-0 duration-1000 delay-500">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-chart-1 to-chart-1/50"></div>
              <CardContent className="pt-6 pl-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-chart-1/10 rounded-full">
                    <Lightbulb className="w-6 h-6 text-chart-1" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Step 4
                      </Badge>
                      <h3 className="font-semibold text-lg">Actionable Insights</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Receive personalized suggestions for improvement based on your text's specific characteristics and
                      areas for enhancement.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">Example Suggestions:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Consider breaking up longer sentences for better readability</li>
                        <li>• Add more transitional phrases to improve flow</li>
                        <li>• Great use of educational terminology</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <Card className="mb-12 animate-in fade-in-0 duration-1000 delay-600">
            <CardHeader>
              <CardTitle className="text-2xl text-center">What Makes Our Analysis Special?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Educational Focus</h4>
                  <p className="text-sm text-muted-foreground">
                    Unlike generic text analyzers, we specialize in educational content with metrics and suggestions
                    tailored for academic and instructional writing.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Real-time Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Get instant results with our optimized processing pipeline that handles texts of any length
                    efficiently.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Multi-dimensional Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    We don't just check grammar - our analysis covers readability, sentiment, complexity, vocabulary
                    diversity, and more.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Actionable Feedback</h4>
                  <p className="text-sm text-muted-foreground">
                    Every analysis comes with specific, actionable suggestions to help you improve your writing
                    immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center animate-in fade-in-0 duration-1000 delay-700">
            <h2 className="text-2xl font-bold mb-4">Ready to Analyze Your Text?</h2>
            <p className="text-muted-foreground mb-6">
              Start improving your writing today with our comprehensive text analysis tool.
            </p>
            <Button size="lg" asChild className="group">
              <Link href="/">
                Try TextAnalyzer Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
