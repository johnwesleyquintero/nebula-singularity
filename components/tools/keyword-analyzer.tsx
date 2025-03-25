"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type KeywordData = {
  keyword: string
  searchVolume: number
  competition: number
  relevance: number
  score: number
}

export function KeywordAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [seedKeywords, setSeedKeywords] = useState("")
  const [analyzedKeywords, setAnalyzedKeywords] = useState<KeywordData[]>([])
  const [activeTab, setActiveTab] = useState("seed")

  const analyzeKeywords = () => {
    setIsAnalyzing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Generate mock data based on input
      const keywords =
        activeTab === "seed"
          ? seedKeywords.split(/[\n,]+/).filter((k) => k.trim())
          : generateKeywordsFromProduct(productName, productDescription)

      const results = keywords.map((keyword) => {
        // Generate mock data for each keyword
        const searchVolume = Math.floor(Math.random() * 10000)
        const competition = Math.random()
        const relevance = Math.random() * 5
        const score = (searchVolume / 1000) * (1 - competition) * (relevance / 5) * 100

        return {
          keyword: keyword.trim().toLowerCase(),
          searchVolume,
          competition,
          relevance,
          score,
        }
      })

      // Sort by score descending
      results.sort((a, b) => b.score - a.score)

      setAnalyzedKeywords(results)
      setIsAnalyzing(false)
    }, 2000)
  }

  const generateKeywordsFromProduct = (name: string, description: string) => {
    // In a real app, this would use NLP or an API
    // For demo, we'll extract words and phrases
    const combinedText = `${name} ${description}`
    const words = combinedText
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3)

    // Remove duplicates
    const uniqueWords = [...new Set(words)]

    // Generate some phrases (pairs of words)
    const phrases = []
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i].length > 2 && words[i + 1].length > 2) {
        phrases.push(`${words[i]} ${words[i + 1]}`)
      }
    }

    return [...uniqueWords, ...phrases].slice(0, 20)
  }

  const getCompetitionLabel = (value: number) => {
    if (value < 0.3) return "Low"
    if (value < 0.7) return "Medium"
    return "High"
  }

  const getCompetitionColor = (value: number) => {
    if (value < 0.3) return "bg-green-100 text-green-800"
    if (value < 0.7) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="seed" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="seed">Seed Keywords</TabsTrigger>
          <TabsTrigger value="product">Product Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="seed" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seed-keywords">Enter Keywords</Label>
            <Textarea
              id="seed-keywords"
              placeholder="Enter keywords separated by commas or new lines"
              className="min-h-[150px]"
              value={seedKeywords}
              onChange={(e) => setSeedKeywords(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter keywords you want to analyze, separated by commas or new lines
            </p>
          </div>
          <Button onClick={analyzeKeywords} disabled={isAnalyzing || !seedKeywords.trim()}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Keywords"
            )}
          </Button>
        </TabsContent>
        <TabsContent value="product" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                placeholder="Enter your product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">Product Description</Label>
              <Textarea
                id="product-description"
                placeholder="Enter your product description"
                className="min-h-[150px]"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={analyzeKeywords} disabled={isAnalyzing || !productName.trim() || !productDescription.trim()}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Generate & Analyze Keywords"
            )}
          </Button>
        </TabsContent>
      </Tabs>

      {analyzedKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Keyword Analysis Results</CardTitle>
            <CardDescription>{analyzedKeywords.length} keywords analyzed and ranked by potential</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-right">Search Volume</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead className="text-right">Relevance</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyzedKeywords.map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                    <TableCell className="text-right">{keyword.searchVolume.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCompetitionColor(keyword.competition)}>
                        {getCompetitionLabel(keyword.competition)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{keyword.relevance.toFixed(1)}/5</TableCell>
                    <TableCell className="text-right font-semibold">{keyword.score.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

