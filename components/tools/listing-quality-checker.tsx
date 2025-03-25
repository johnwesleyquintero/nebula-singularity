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

const listingFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  bulletPoints: z.string().min(1, "Bullet points are required"),
  description: z.string().min(1, "Description is required"),
  keywords: z.string().optional(),
})

type ListingFormValues = z.infer<typeof listingFormSchema>

type ScoreCategory = {
  name: string
  score: number
  maxScore: number
  feedback: string[]
}

type ListingAnalysis = {
  overallScore: number
  categories: ScoreCategory[]
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
      // Title analysis
      const titleLength = values.title.length
      const titleWords = values.title.split(/\s+/).filter((w) => w.trim()).length

      const titleScore = {
        name: "Title",
        score: 0,
        maxScore: 25,
        feedback: [],
      }

      // Check title length
      if (titleLength < 80) {
        titleScore.feedback.push("Title is too short. Amazon allows up to 200 characters.")
      } else if (titleLength > 150) {
        titleScore.score += 15
        titleScore.feedback.push("Good title length, using most of the available space.")
      } else {
        titleScore.score += 10
        titleScore.feedback.push("Acceptable title length, but could use more characters.")
      }

      // Check keyword usage in title
      const keywordList = values.keywords
        ? values.keywords
            .toLowerCase()
            .split(/[,\n]+/)
            .map((k) => k.trim())
        : []
      let keywordsInTitle = 0

      if (keywordList.length > 0) {
        keywordsInTitle = keywordList.filter((keyword) => values.title.toLowerCase().includes(keyword)).length

        const keywordPercentage = keywordsInTitle / keywordList.length

        if (keywordPercentage > 0.7) {
          titleScore.score += 10
          titleScore.feedback.push("Excellent keyword usage in title.")
        } else if (keywordPercentage > 0.3) {
          titleScore.score += 5
          titleScore.feedback.push("Good keyword usage, but could include more target keywords.")
        } else {
          titleScore.feedback.push("Poor keyword usage. Include more target keywords in your title.")
        }
      }

      // Bullet points analysis
      const bulletPoints = values.bulletPoints.split(/\n+/).filter((b) => b.trim())
      const bulletScore = {
        name: "Bullet Points",
        score: 0,
        maxScore: 25,
        feedback: [],
      }

      // Check number of bullet points
      if (bulletPoints.length >= 5) {
        bulletScore.score += 10
        bulletScore.feedback.push("Good use of all available bullet points.")
      } else {
        bulletScore.feedback.push(
          `Only using ${bulletPoints.length}/5 bullet points. Add more for better listing quality.`,
        )
      }

      // Check bullet point length
      const avgBulletLength = bulletPoints.reduce((sum, bullet) => sum + bullet.length, 0) / (bulletPoints.length || 1)

      if (avgBulletLength > 150) {
        bulletScore.score += 15
        bulletScore.feedback.push("Detailed bullet points with good information density.")
      } else if (avgBulletLength > 80) {
        bulletScore.score += 10
        bulletScore.feedback.push("Acceptable bullet point length, but could be more detailed.")
      } else {
        bulletScore.feedback.push("Bullet points are too short. Add more details about features and benefits.")
      }

      // Description analysis
      const descriptionLength = values.description.length
      const descriptionScore = {
        name: "Description",
        score: 0,
        maxScore: 25,
        feedback: [],
      }

      // Check description length
      if (descriptionLength > 1000) {
        descriptionScore.score += 15
        descriptionScore.feedback.push("Excellent description length with detailed information.")
      } else if (descriptionLength > 500) {
        descriptionScore.score += 10
        descriptionScore.feedback.push("Good description length, but could be more detailed.")
      } else {
        descriptionScore.feedback.push("Description is too short. Add more details about your product.")
      }

      // Check for formatting in description
      if (values.description.includes("\n\n") || values.description.includes("<p>")) {
        descriptionScore.score += 5
        descriptionScore.feedback.push("Good use of formatting in description for readability.")
      } else {
        descriptionScore.feedback.push("Improve formatting with paragraphs for better readability.")
      }

      // Check for brand mentions
      if (values.description.toLowerCase().includes("brand") || values.description.toLowerCase().includes("warranty")) {
        descriptionScore.score += 5
        descriptionScore.feedback.push("Good mention of brand and/or warranty information.")
      } else {
        descriptionScore.feedback.push("Consider adding brand and warranty information to build trust.")
      }

      // Keywords analysis
      const keywordScore = {
        name: "Keywords",
        score: 0,
        maxScore: 25,
        feedback: [],
      }

      if (keywordList.length > 10) {
        keywordScore.score += 10
        keywordScore.feedback.push("Good number of target keywords identified.")
      } else if (keywordList.length > 5) {
        keywordScore.score += 5
        keywordScore.feedback.push("Acceptable number of keywords, but could identify more.")
      } else {
        keywordScore.feedback.push("Too few target keywords. Identify more relevant search terms.")
      }

      // Check keyword distribution
      let keywordsInBullets = 0
      let keywordsInDescription = 0

      if (keywordList.length > 0) {
        keywordsInBullets = keywordList.filter((keyword) => values.bulletPoints.toLowerCase().includes(keyword)).length

        keywordsInDescription = keywordList.filter((keyword) =>
          values.description.toLowerCase().includes(keyword),
        ).length

        const bulletKeywordPercentage = keywordsInBullets / keywordList.length
        const descKeywordPercentage = keywordsInDescription / keywordList.length

        if (bulletKeywordPercentage > 0.6 && descKeywordPercentage > 0.6) {
          keywordScore.score += 15
          keywordScore.feedback.push("Excellent keyword distribution across listing elements.")
        } else if (bulletKeywordPercentage > 0.3 && descKeywordPercentage > 0.3) {
          keywordScore.score += 10
          keywordScore.feedback.push("Good keyword distribution, but could be improved.")
        } else {
          keywordScore.feedback.push("Poor keyword distribution. Ensure keywords appear in all listing elements.")
        }
      }

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
                    {analysis.overallScore >= 80
                      ? "Excellent listing quality"
                      : analysis.overallScore >= 60
                        ? "Good listing quality with room for improvement"
                        : "Listing needs significant improvement"}
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

