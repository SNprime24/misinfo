import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, options } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock analysis logic (replace with real analysis service)
    const words = text.split(" ").filter((word) => word.length > 0)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

    const analysisResult = {
      readabilityScore: Math.floor(Math.random() * 40) + 60,
      sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)],
      keyTopics: extractKeywords(text),
      wordCount: words.length,
      readingTime: Math.ceil(words.length / 200),
      complexity: words.length > 500 ? "complex" : words.length > 200 ? "moderate" : "simple",
      educationalLevel: determineEducationalLevel(text),
      grammarScore: Math.floor(Math.random() * 30) + 70,
      vocabularyDiversity: Math.floor(Math.random() * 40) + 60,
      suggestions: generateSuggestions(text, sentences),
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze text" }, { status: 500 })
  }
}

function extractKeywords(text: string): string[] {
  const commonWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"]
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

function determineEducationalLevel(text: string): string {
  const words = text.split(" ")
  const avgWordLength = words.reduce((acc, word) => acc + word.length, 0) / words.length

  if (avgWordLength > 6) return "College Level"
  if (avgWordLength > 5) return "High School Level"
  return "Middle School Level"
}

function generateSuggestions(text: string, sentences: string[]): string[] {
  const suggestions = []
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(" ").length, 0) / sentences.length

  if (avgSentenceLength > 25) {
    suggestions.push("Consider breaking up longer sentences for better readability")
  }
  if (text.includes("very") || text.includes("really")) {
    suggestions.push("Try using more specific adjectives instead of intensifiers")
  }
  if (sentences.length < 3) {
    suggestions.push("Consider expanding your content with more detailed explanations")
  }

  suggestions.push("Great work on your content structure!")
  return suggestions.slice(0, 4)
}
