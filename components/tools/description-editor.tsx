"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, Check, Wand2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function DescriptionEditor() {
  const [productName, setProductName] = useState("");
  const [productFeatures, setProductFeatures] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [optimizedDescription, setOptimizedDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateDescription = () => {
    if (!productName || !productFeatures) return;

    setIsGenerating(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const features = productFeatures.split(/\n+/).filter((f) => f.trim());

      // Generate a description based on the product name and features
      let description = `<h2>${productName} - Premium Quality and Performance</h2>\n\n`;
      description += `<p>Introducing the <strong>${productName}</strong>, designed to provide exceptional performance and reliability for all your needs.</p>\n\n`;

      description += "<h3>Key Features:</h3>\n<ul>\n";
      features.forEach((feature) => {
        description += `<li>${feature}</li>\n`;
      });
      description += "</ul>\n\n";

      description += `<p>The ${productName} is crafted with premium materials and built to last. Our rigorous quality control ensures that every product meets the highest standards before reaching our customers.</p>\n\n`;

      description += "<h3>Why Choose Us:</h3>\n<ul>\n";
      description += "<li>Premium quality materials for durability</li>\n";
      description += "<li>Exceptional customer service</li>\n";
      description += "<li>30-day money-back guarantee</li>\n";
      description += "<li>1-year warranty on all products</li>\n";
      description += "</ul>\n\n";

      description += `<p>Experience the difference with the ${productName}. Order now and elevate your experience!</p>`;

      setGeneratedDescription(description);
      setIsGenerating(false);
    }, 2000);
  };

  const optimizeDescription = () => {
    if (!originalDescription || !targetKeywords) return;

    setIsOptimizing(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const keywords = targetKeywords
        .split(/[,\n]+/)
        .map((k) => k.trim())
        .filter(Boolean);
      let description = originalDescription;

      // Simple optimization: ensure keywords are included and add some HTML formatting
      keywords.forEach((keyword) => {
        // If keyword isn't in the description, add it
        if (!description.toLowerCase().includes(keyword.toLowerCase())) {
          description += `\n\n<p>Our ${keyword} is designed with you in mind, providing the perfect solution for your needs.</p>`;
        }

        // Add some emphasis to the first occurrence of each keyword
        const regex = new RegExp(`(${keyword})`, "i");
        if (
          !description.includes("<strong>") ||
          !description
            .toLowerCase()
            .includes(`<strong>${keyword.toLowerCase()}`)
        ) {
          description = description.replace(regex, "<strong>$1</strong>");
        }
      });

      // Add some basic HTML structure if not present
      if (!description.includes("<h2>")) {
        description = `<h2>Product Description</h2>\n\n${description}`;
      }

      if (!description.includes("<ul>")) {
        description += "\n\n<h3>Benefits:</h3>\n<ul>";
        keywords.slice(0, 3).forEach((keyword) => {
          description += `\n<li>Enhanced ${keyword} performance</li>`;
        });
        description += "\n</ul>";
      }

      // Add a call to action if not present
      if (
        !description.toLowerCase().includes("order now") &&
        !description.toLowerCase().includes("buy now")
      ) {
        description +=
          "\n\n<p><strong>Order now</strong> and experience the difference!</p>";
      }

      setOptimizedDescription(description);
      setIsOptimizing(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">Generate Description</TabsTrigger>
          <TabsTrigger value="optimize">Optimize Existing</TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
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
                <Label htmlFor="product-features">Key Features</Label>
                <Textarea
                  id="product-features"
                  placeholder="Enter key features (one per line)"
                  className="min-h-[200px]"
                  value={productFeatures}
                  onChange={(e) => setProductFeatures(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter each feature on a new line. Include the most important
                  benefits.
                </p>
              </div>

              <Button
                onClick={generateDescription}
                disabled={isGenerating || !productName || !productFeatures}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Description
                  </>
                )}
              </Button>
            </div>

            <div>
              {generatedDescription ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Generated Description
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedDescription)}
                      disabled={copied}
                    >
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
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[400px] overflow-y-auto rounded border bg-muted/50 p-4">
                      <pre className="whitespace-pre-wrap text-sm">
                        {generatedDescription}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <Wand2 className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">
                      Generate a Description
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your product details to generate an optimized
                      description
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="optimize" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="original-description">
                  Original Description
                </Label>
                <Textarea
                  id="original-description"
                  placeholder="Paste your current product description"
                  className="min-h-[200px]"
                  value={originalDescription}
                  onChange={(e) => setOriginalDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-keywords">Target Keywords</Label>
                <Textarea
                  id="target-keywords"
                  placeholder="Enter target keywords (separated by commas or new lines)"
                  className="min-h-[100px]"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter keywords you want to include in your optimized
                  description
                </p>
              </div>

              <Button
                onClick={optimizeDescription}
                disabled={
                  isOptimizing || !originalDescription || !targetKeywords
                }
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Optimize Description
                  </>
                )}
              </Button>
            </div>

            <div>
              {optimizedDescription ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Optimized Description
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(optimizedDescription)}
                      disabled={copied}
                    >
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
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {targetKeywords.split(/[,\n]+/).map(
                          (keyword, index) =>
                            keyword.trim() && (
                              <Badge key={index} variant="outline">
                                {keyword.trim()}
                              </Badge>
                            ),
                        )}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto rounded border bg-muted/50 p-4">
                        <pre className="whitespace-pre-wrap text-sm">
                          {optimizedDescription}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <Wand2 className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">
                      Optimize Your Description
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Paste your current description and target keywords to
                      optimize
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Alert>
        <AlertDescription>
          HTML formatting is supported. Use tags like &lt;h2&gt;, &lt;p&gt;,
          &lt;ul&gt;, &lt;li&gt;, and &lt;strong&gt; for better formatting on
          Amazon.
        </AlertDescription>
      </Alert>
    </div>
  );
}
