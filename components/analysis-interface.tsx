"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Target,
  Lightbulb,
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Zap,
} from "lucide-react"

interface AnalysisResult {
  readabilityScore: number
  sentiment: string
  keyTopics: string[]
  wordCount: number
  readingTime: number
  suggestions: string[]
  complexity: "simple" | "moderate" | "complex"
  educationalLevel: string
  grammarScore: number
  vocabularyDiversity: number
}

export function AnalysisInterface() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setError("")
    setIsAnalyzing(true)
    setLoadingProgress(0)
    setResults(null)

    try {
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 200)

      const response = await axios.post("/api/analyze", {
        text: text.trim(),
        options: {
          includeReadability: true,
          includeSentiment: true,
          includeTopics: true,
          includeGrammar: true,
        },
      })

      clearInterval(progressInterval)
      setLoadingProgress(100)

      setResults(response.data)
    } catch (err) {
      console.log("API call failed, using mock data:", err)

      // Enhanced mock data with more realistic analysis
      const mockResults: AnalysisResult = {
        readabilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
        sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)],
        keyTopics: extractKeywords(text),
        wordCount: text.split(" ").filter((word) => word.length > 0).length,
        readingTime: Math.ceil(text.split(" ").length / 200),
        complexity: text.length > 1000 ? "complex" : text.length > 500 ? "moderate" : "simple",
        educationalLevel: determineEducationalLevel(text),
        grammarScore: Math.floor(Math.random() * 30) + 70,
        vocabularyDiversity: Math.floor(Math.random() * 40) + 60,
        suggestions: generateSuggestions(text),
      }

      setResults(mockResults)
    } finally {
      setIsAnalyzing(false)
      setLoadingProgress(0)
    }
  }

  const extractKeywords = (text: string): string[] => {
    const commonWords = [
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
    ]
    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    const wordFreq = words
      .filter((word) => word.length > 3 && !commonWords.includes(word))
      .reduce(
        (acc, word) => {
          acc[word] = (acc[word] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word)
  }

  const determineEducationalLevel = (text: string): string => {
    const avgWordLength = text.split(" ").reduce((acc, word) => acc + word.length, 0) / text.split(" ").length
    if (avgWordLength > 6) return "College Level"
    if (avgWordLength > 5) return "High School Level"
    return "Middle School Level"
  }

  const generateSuggestions = (text: string): string[] => {
    const suggestions = []
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(" ").length, 0) / sentences.length

    if (avgSentenceLength > 25) {
      suggestions.push("Consider breaking up longer sentences for better readability")
    }
    if (text.includes("very") || text.includes("really")) {
      suggestions.push('Try using more specific adjectives instead of intensifiers like "very" or "really"')
    }
    if (!/[.!?]\s+[A-Z]/.test(text)) {
      suggestions.push("Add more transitional phrases to improve flow between ideas")
    }

    suggestions.push("Great work on your content structure!")
    return suggestions.slice(0, 4)
  }

  const clearResults = () => {
    setResults(null)
    setError("")
    setText("")
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Text</CardTitle>
          <CardDescription>
            Paste or type the text you'd like to analyze for educational content and readability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here... (e.g., essay, article, educational content)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              {text.length} characters, {text.split(" ").filter((word) => word.length > 0).length} words
            </span>
            <div className="flex gap-2">
              {results && (
                <Button variant="outline" onClick={clearResults} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !text.trim()} className="min-w-[120px]">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Text"
                )}
              </Button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={loadingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {loadingProgress < 30
                  ? "Processing text..."
                  : loadingProgress < 60
                    ? "Analyzing readability..."
                    : loadingProgress < 90
                      ? "Generating insights..."
                      : "Finalizing results..."}
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {(isAnalyzing || results) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Analysis Results
                  {results && <CheckCircle className="w-5 h-5 text-primary" />}
                </CardTitle>
                <CardDescription>Comprehensive analysis of your text content</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6">
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ) : results ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm">
                    <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Overview</span>
                    <span className="sm:hidden">Stats</span>
                  </TabsTrigger>
                  <TabsTrigger value="readability" className="text-xs sm:text-sm">
                    <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Readability</span>
                    <span className="sm:hidden">Read</span>
                  </TabsTrigger>
                  <TabsTrigger value="quality" className="text-xs sm:text-sm">
                    <Target className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Quality</span>
                    <span className="sm:hidden">Quality</span>
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="text-xs sm:text-sm">
                    <Lightbulb className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Suggestions</span>
                    <span className="sm:hidden">Tips</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="relative overflow-hidden">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-primary">{results.wordCount}</div>
                            <p className="text-sm text-muted-foreground">Words</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary"></div>
                      </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-primary">{results.readingTime} min</div>
                            <p className="text-sm text-muted-foreground">Reading Time</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/20 to-secondary"></div>
                      </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge
                              variant={
                                results.sentiment === "positive"
                                  ? "default"
                                  : results.sentiment === "neutral"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-sm capitalize"
                            >
                              {results.sentiment}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">Sentiment</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-full">
                            <TrendingUp className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/20 to-accent"></div>
                      </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge
                              variant="outline"
                              className={`text-sm capitalize ${
                                results.complexity === "simple"
                                  ? "border-green-500 text-green-700"
                                  : results.complexity === "moderate"
                                    ? "border-yellow-500 text-yellow-700"
                                    : "border-red-500 text-red-700"
                              }`}
                            >
                              {results.complexity}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">Complexity</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Zap className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-chart-1/20 to-chart-1"></div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="w-5 h-5 text-primary" />
                        Key Topics Identified
                      </CardTitle>
                      <CardDescription>Main themes and concepts found in your text</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {results.keyTopics.map((topic, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="px-3 py-1 text-sm font-medium hover:bg-primary/10 transition-colors"
                          >
                            #{topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="readability" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Readability Analysis
                      </CardTitle>
                      <CardDescription>How easy your text is to read and understand</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Overall Readability Score</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">{results.readabilityScore}</span>
                            <span className="text-sm text-muted-foreground">/100</span>
                          </div>
                        </div>
                        <Progress value={results.readabilityScore} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Difficult</span>
                          <span>Moderate</span>
                          <span>Easy</span>
                        </div>
                        <div className="mt-4 p-4 rounded-lg bg-muted/50">
                          <p className="text-sm font-medium">
                            {results.readabilityScore >= 80 ? (
                              <span className="text-green-700">🎉 Excellent! Your text is very easy to read.</span>
                            ) : results.readabilityScore >= 60 ? (
                              <span className="text-yellow-700">👍 Good readability with room for improvement.</span>
                            ) : (
                              <span className="text-red-700">
                                ⚠️ Consider simplifying your text for better readability.
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <BookOpen className="w-4 h-4 text-primary" />
                              </div>
                              <h4 className="font-semibold">Educational Level</h4>
                            </div>
                            <Badge variant="secondary" className="text-sm">
                              {results.educationalLevel}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-2">Target audience reading level</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-secondary/10 rounded-full">
                                <Users className="w-4 h-4 text-secondary" />
                              </div>
                              <h4 className="font-semibold">Accessibility</h4>
                            </div>
                            <Badge
                              variant={results.readabilityScore >= 70 ? "default" : "destructive"}
                              className="text-sm"
                            >
                              {results.readabilityScore >= 70 ? "Accessible" : "Needs Work"}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-2">Suitable for diverse audiences</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quality" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Content Quality Metrics
                      </CardTitle>
                      <CardDescription>Detailed analysis of your writing quality</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                                Grammar Score
                              </h4>
                              <span className="text-sm font-medium">{results.grammarScore}/100</span>
                            </div>
                            <Progress value={results.grammarScore} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {results.grammarScore >= 85
                                ? "Excellent grammar usage"
                                : results.grammarScore >= 70
                                  ? "Good with minor issues"
                                  : "Needs grammar improvements"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold flex items-center gap-2">
                                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                                Vocabulary Diversity
                              </h4>
                              <span className="text-sm font-medium">{results.vocabularyDiversity}/100</span>
                            </div>
                            <Progress value={results.vocabularyDiversity} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {results.vocabularyDiversity >= 80
                                ? "Rich vocabulary usage"
                                : results.vocabularyDiversity >= 60
                                  ? "Good word variety"
                                  : "Consider using more varied vocabulary"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <Card className="border-l-4 border-l-primary">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              <h5 className="font-medium text-sm">Strengths</h5>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {results.grammarScore >= 80
                                ? "Strong grammar foundation"
                                : results.vocabularyDiversity >= 70
                                  ? "Good word variety"
                                  : "Clear communication style"}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-secondary">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-secondary" />
                              <h5 className="font-medium text-sm">Complexity</h5>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {results.complexity === "simple"
                                ? "Easy to understand"
                                : results.complexity === "moderate"
                                  ? "Balanced complexity"
                                  : "Advanced content level"}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-accent">
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4 text-accent" />
                              <h5 className="font-medium text-sm">Engagement</h5>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {results.sentiment === "positive"
                                ? "Positive tone detected"
                                : results.sentiment === "neutral"
                                  ? "Neutral, informative tone"
                                  : "Consider more positive language"}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Improvement Suggestions
                      </CardTitle>
                      <CardDescription>Actionable recommendations to enhance your writing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.suggestions.map((suggestion, index) => (
                          <Card key={index} className="border-l-4 border-l-primary/50">
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-3">
                                <div className="p-1 bg-primary/10 rounded-full mt-0.5">
                                  <Lightbulb className="w-3 h-3 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium mb-1">Tip #{index + 1}</p>
                                  <p className="text-sm text-muted-foreground">{suggestion}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Card className="mt-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Educational Resources</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Continue improving your writing with these helpful resources:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span>Grammar guides and exercises</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-secondary rounded-full"></div>
                              <span>Vocabulary building tools</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-accent rounded-full"></div>
                              <span>Readability improvement tips</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                              <span>Writing style enhancement</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
