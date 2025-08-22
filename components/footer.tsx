import Link from "next/link"
import { BookOpen, Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card/30 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TextAnalyzer
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced text analysis for educational content and writing improvement.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Text Analyzer
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link
                href="/how-it-works"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                How it Works
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Writing Tips
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Grammar Guide
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Readability Tips
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2024 TextAnalyzer. Built with Next.js and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  )
}
