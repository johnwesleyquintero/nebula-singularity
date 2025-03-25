"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { listingQualityConfig } from "./listing-quality-checker.config"

import { commonValidationSchemas } from "@/lib/common-utils"

const listingFormSchema = z.object({
  title: commonValidationSchemas.title,
  description: commonValidationSchemas.description,
  bulletPoints: z.string(),
  keywords: commonValidationSchemas.keywords
})

type ListingFormValues = z.infer<typeof listingFormSchema>

interface ScoreCategory {
  name: string
  score: number
  maxScore: number
  feedback: string[]
}

interface ListingAnalysis {
  overallScore: number
  categories: ScoreCategory[]
}

function analyzeTitle(title: string, keywords: string[]): ScoreCategory {
  const config = listingQualityConfig.title
  const score = {
    name: config.name,
    score: 0,
    maxScore: config.maxScore,
    feedback: [],
  }

  if (title.length < config.thresholds.good) {
    score.feedback.push(config.feedbackMessages.poor)
  } else if (title.length > config.thresholds.excellent) {
    score.score += 15
    score.feedback.push(config.feedbackMessages.excellent)
  } else {
    score.score += 10
    score.feedback.push(config.feedbackMessages.good)
  }

  if (keywords.length > 0) {
    const keywordsInTitle = keywords.filter((keyword) => title.toLowerCase().includes(keyword)).length
    const keywordPercentage = calculationUtils.calculatePercentage(keywordsInTitle, keywords.length)

    if (keywordPercentage > 0.7) {
      score.score += 10
      score.feedback.push("Excellent keyword usage in title.")
    } else if (keywordPercentage > 0.3) {
      score.score += 5
      score.feedback.push("Good keyword usage, but could include more target keywords.")
    } else {
      score.feedback.push("Poor keyword usage. Include more target keywords in your title.")
    }
  }

  return score
}

function analyzeBulletPoints(bulletPoints: string[], keywords: string[]): ScoreCategory {
  const config = listingQualityConfig.bulletPoints
  const score = {
    name: config.name,
    score: 0,
    maxScore: config.maxScore,
    feedback: [],
  }

  if (bulletPoints.length >= 5) {
    score.score += 10
    score.feedback.push("Good use of all available bullet points.")
  } else {
    score.feedback.push(`Only using ${bulletPoints.length}/5 bullet points. Add more for better listing quality.`)
  }

  const avgBulletLength = bulletPoints.reduce((sum, bullet) => sum + bullet.length, 0) / (bulletPoints.length || 1)

  if (avgBulletLength > config.thresholds.excellent) {
    score.score += 15
    score.feedback.push(config.feedbackMessages.excellent)
  } else if (avgBulletLength > config.thresholds.good) {
    score.score += 10
    score.feedback.push(config.feedbackMessages.good)
  } else {
    score.feedback.push(config.feedbackMessages.poor)
  }

  return score
}

function analyzeDescription(description: string): ScoreCategory {
  const config = listingQualityConfig.description
  const score = {
    name: config.name,
    score: 0,
    maxScore: config.maxScore,
    feedback: [],
  }

  if (description.length > config.thresholds.excellent) {
    score.score += 15
    score.feedback.push(config.feedbackMessages.excellent)
  } else if (description.length > config.thresholds.good) {
    score.score += 10
    score.feedback.push(config.feedbackMessages.good)
  } else {
    score.feedback.push(config.feedbackMessages.poor)
  }

  if (description.includes("\n\n") || description.includes("<p>")) {
    score.score += 5
    score.feedback.push("Good use of formatting in description for readability.")
  } else {
    score.feedback.push("Improve formatting with paragraphs for better readability.")
  }

  if (description.toLowerCase().includes("brand") || description.toLowerCase().includes("warranty")) {
    score.score += 5
    score.feedback.push("Good mention of brand and/or warranty information.")
  } else {
    score.feedback.push("Consider adding brand and warranty information to build trust.")
  }

  return score
}

function analyzeKeywords(keywords: string[], bulletPoints: string, description: string): ScoreCategory {
  const config = listingQualityConfig.keywords
  const score = {
    name: config.name,
    score: 0,
    maxScore: config.maxScore,
    feedback: [],
  }

  if (keywords.length > config.thresholds.excellent) {
    score.score += 10
    score.feedback.push("Good number of target keywords identified.")
  } else if (keywords.length > config.thresholds.good) {
    score.score += 5
    score.feedback.push("Acceptable number of keywords, but could identify more.")
  } else {
    score.feedback.push("Too few target keywords. Identify more relevant search terms.")
  }

  if (keywords.length > 0) {
    const keywordsInBullets = keywords.filter((keyword) => bulletPoints.toLowerCase().includes(keyword)).length
    const keywordsInDescription = keywords.filter((keyword) => description.toLowerCase().includes(keyword)).length

    const bulletKeywordPercentage = keywordsInBullets / keywords.length
    const descKeywordPercentage = keywordsInDescription / keywords.length

    if (bulletKeywordPercentage > 0.6 && descKeywordPercentage > 0.6) {
      score.score += 15
      score.feedback.push(config.feedbackMessages.excellent)
    } else if (bulletKeywordPercentage > 0.3 && descKeywordPercentage > 0.3) {
      score.score += 10
      score.feedback.push(config.feedbackMessages.good)
    } else {
      score.feedback.push(config.feedbackMessages.poor)
    }
  }

  return score
}

export function ListingQualityChecker() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ListingAnalysis | null>(null)

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      bulletPoints: "",
      description: "",
      keywords: "",
    },
  })

  function analyzeListing(values: ListingFormValues) {
    setIsAnalyzing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      const keywordList = values.keywords
        ? values.keywords
            .toLowerCase()
            .split(/[,\n]+/)
            .map((k) => k.trim())
        : []

      const bulletPoints = values.bulletPoints.split(/\n+/).filter((b) => b.trim())

      const titleScore = analyzeTitle(values.title, keywordList)
      const bulletScore = analyzeBulletPoints(bulletPoints, keywordList)
      const descriptionScore = analyzeDescription(values.description)
      const keywordScore = analyzeKeywords(keywordList, values.bulletPoints, values.description)

      // Calculate overall score
      const categories = [titleScore, bulletScore, descriptionScore, keywordScore]
      const totalScore = categories.reduce((sum, category) => sum + category.score, 0)
      const maxPossibleScore = categories.reduce((sum, category) => sum + category.maxScore, 0)
      const overallScore = Math.round((totalScore / maxPossibleScore) * 100)

      setAnalysis({
        overallScore,
        categories,
      })

      setIsAnalyzing(false)
    }, 2000)
  }

  function onSubmit(values: ListingFormValues) {
    analyzeListing(values)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="input">
        <TabsList>
          <TabsTrigger value="input">Listing Details</TabsTrigger>
          {analysis && <TabsTrigger value="results">Analysis Results</TabsTrigger>}
        </TabsList>
        <TabsContent value="input" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Amazon product title" {...field} />
                    </FormControl>
                    <FormDescription>Amazon allows up to 200 characters for product titles</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bulletPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bullet Points</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your bullet points (one per line)"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter each bullet point on a new line. Amazon allows up to 5 bullet points.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your product description" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormDescription>A detailed description helps customers make informed decisions</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Keywords (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your target keywords, separated by commas or new lines"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Adding your target keywords helps us analyze keyword usage in your listing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Listing...
                  </>
                ) : (
                  "Analyze Listing Quality"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
        {analysis && (
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Listing Quality</CardTitle>
                <CardDescription>
                  Based on analysis of your title, bullet points, description, and keywords
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-4xl font-bold">{analysis.overallScore}%</div>
                  <Progress value={analysis.overallScore} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {analysis.overallScore >= listingQualityConfig.overallScoreThresholds.excellent
                      ? listingQualityConfig.overallFeedback.excellent
                      : analysis.overallScore >= listingQualityConfig.overallScoreThresholds.good
                        ? listingQualityConfig.overallFeedback.good
                        : listingQualityConfig.overallFeedback.poor}
                  </p>
                </div>
              </CardContent>
            </Card>

            {analysis.categories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {category.name}
                    <span className="ml-auto text-lg">
                      {category.score}/{category.maxScore} points
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={(category.score / category.maxScore) * 100} className="w-full" />
                  <div className="space-y-2">
                    {category.feedback.map((feedback, i) => (
                      <Alert
                        key={i}
                        variant={
                          feedback.toLowerCase().includes("excellent") || feedback.toLowerCase().includes("good")
                            ? "default"
                            : "destructive"
                        }
                      >
                        <div className="flex items-start">
                          {feedback.toLowerCase().includes("excellent") || feedback.toLowerCase().includes("good") ? (
                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                          )}
                          <div>
                            <AlertTitle>
                              {feedback.toLowerCase().includes("excellent") || feedback.toLowerCase().includes("good")
                                ? "Strength"
                                : "Improvement Needed"}
                            </AlertTitle>
                            <AlertDescription>{feedback}</AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Next Steps</AlertTitle>
              <AlertDescription>
                Use this analysis to improve your listing quality. Focus on areas with the lowest scores first.
              </AlertDescription>
            </Alert>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

import { calculationUtils } from "@/lib/common-utils"

