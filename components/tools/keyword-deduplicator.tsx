"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Check, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function KeywordDeduplicator() {
  const [inputKeywords, setInputKeywords] = useState("")
  const [outputKeywords, setOutputKeywords] = useState("")
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [sortAlphabetically, setSortAlphabetically] = useState(true)
  const [removeStopWords, setRemoveStopWords] = useState(false)
  const [stats, setStats] = useState<{
    original: number
    unique: number
    duplicates: number
    stopWords: number
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const deduplicateKeywords = () => {
    if (!inputKeywords.trim()) return

    // Split keywords by commas, new lines, or semicolons
    const keywordsArray = inputKeywords.split(/[,;\n]+/)

    // Process each keyword based on options
    const processedKeywords = keywordsArray
      .map((keyword) => {
        let processed = keyword

        // Trim whitespace if option is selected
        if (trimWhitespace) {
          processed = processed.trim()
        }

        // Convert to lowercase if not case sensitive
        if (!caseSensitive) {
          processed = processed.toLowerCase()
        }

        return processed
      })
      .filter(Boolean) // Remove empty strings

    // Count original keywords (excluding empty strings)
    const originalCount = processedKeywords.length

    // Remove duplicates
    const uniqueKeywords = [...new Set(processedKeywords)]

    // Remove stop words if option is selected
    let stopWordsCount = 0
    if (removeStopWords) {
      const stopWords = ["a", "an", "the", "and", "or", "but", "for", "with", "in", "on", "at", "to", "of", "by"]
      const filteredKeywords = uniqueKeywords.filter((keyword) => {
        // Only filter out single-word stop words
        if (keyword.split(/\s+/).length === 1 && stopWords.includes(keyword.toLowerCase())) {
          stopWordsCount++
          return false
        }
        return true
      })

      // Sort alphabetically if option is selected
      if (sortAlphabetically) {
        filteredKeywords.sort((a, b) => a.localeCompare(b))
      }

      setOutputKeywords(filteredKeywords.join("\n"))
      setStats({
        original: originalCount,
        unique: filteredKeywords.length,
        duplicates: originalCount - uniqueKeywords.length,
        stopWords: stopWordsCount,
      })
    } else {
      // Sort alphabetically if option is selected
      if (sortAlphabetically) {
        uniqueKeywords.sort((a, b) => a.localeCompare(b))
      }

      setOutputKeywords(uniqueKeywords.join("\n"))
      setStats({
        original: originalCount,
        unique: uniqueKeywords.length,
        duplicates: originalCount - uniqueKeywords.length,
        stopWords: 0,
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputKeywords)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setInputKeywords("")
    setOutputKeywords("")
    setStats(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-keywords">Input Keywords</Label>
            <Textarea
              id="input-keywords"
              placeholder="Enter keywords separated by commas, semicolons, or new lines"
              className="min-h-[300px]"
              value={inputKeywords}
              onChange={(e) => setInputKeywords(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Paste your keywords here. The tool will remove duplicates based on your settings.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="case-sensitive"
                checked={caseSensitive}
                onCheckedChange={(checked) => setCaseSensitive(!!checked)}
              />
              <Label htmlFor="case-sensitive">Case sensitive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trim-whitespace"
                checked={trimWhitespace}
                onCheckedChange={(checked) => setTrimWhitespace(!!checked)}
              />
              <Label htmlFor="trim-whitespace">Trim whitespace</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sort-alphabetically"
                checked={sortAlphabetically}
                onCheckedChange={(checked) => setSortAlphabetically(!!checked)}
              />
              <Label htmlFor="sort-alphabetically">Sort alphabetically</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remove-stop-words"
                checked={removeStopWords}
                onCheckedChange={(checked) => setRemoveStopWords(!!checked)}
              />
              <Label htmlFor="remove-stop-words">Remove common stop words</Label>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={deduplicateKeywords} disabled={!inputKeywords.trim()}>
              <Filter className="mr-2 h-4 w-4" />
              Deduplicate Keywords
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Deduplicated Keywords</CardTitle>
              {outputKeywords && (
                <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={copied}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      Original: {stats.original}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      Unique: {stats.unique}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      Duplicates: {stats.duplicates}
                    </Badge>
                    {removeStopWords && (
                      <Badge variant="outline" className="bg-primary/10">
                        Stop Words: {stats.stopWords}
                      </Badge>
                    )}
                  </div>
                  <Textarea readOnly className="min-h-[300px]" value={outputKeywords} />
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <Filter className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No Keywords Processed</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter keywords and click "Deduplicate Keywords" to get started
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

