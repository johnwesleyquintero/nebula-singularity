// Configuration for the Listing Quality Checker

export interface ScoreConfig {
  name: string
  maxScore: number
  thresholds: {
    excellent: number
    good: number
  }
  feedbackMessages: {
    excellent: string
    good: string
    poor: string
  }
}

export interface ListingQualityConfig {
  title: ScoreConfig
  bulletPoints: ScoreConfig
  description: ScoreConfig
  keywords: ScoreConfig
  overallScoreThresholds: {
    excellent: number
    good: number
  }
  overallFeedback: {
    excellent: string
    good: string
    poor: string
  }
}

export const listingQualityConfig: ListingQualityConfig = {
  title: {
    name: "Title",
    maxScore: 25,
    thresholds: {
      excellent: 150,
      good: 80,
    },
    feedbackMessages: {
      excellent: "Good title length, using most of the available space.",
      good: "Acceptable title length, but could use more characters.",
      poor: "Title is too short. Amazon allows up to 200 characters.",
    },
  },
  bulletPoints: {
    name: "Bullet Points",
    maxScore: 25,
    thresholds: {
      excellent: 150,
      good: 80,
    },
    feedbackMessages: {
      excellent: "Detailed bullet points with good information density.",
      good: "Acceptable bullet point length, but could be more detailed.",
      poor: "Bullet points are too short. Add more details about features and benefits.",
    },
  },
  description: {
    name: "Description",
    maxScore: 25,
    thresholds: {
      excellent: 1000,
      good: 500,
    },
    feedbackMessages: {
      excellent: "Excellent description length with detailed information.",
      good: "Good description length, but could be more detailed.",
      poor: "Description is too short. Add more details about your product.",
    },
  },
  keywords: {
    name: "Keywords",
    maxScore: 25,
    thresholds: {
      excellent: 10,
      good: 5,
    },
    feedbackMessages: {
      excellent: "Excellent keyword distribution across listing elements.",
      good: "Good keyword distribution, but could be improved.",
      poor: "Poor keyword distribution. Ensure keywords appear in all listing elements.",
    },
  },
  overallScoreThresholds: {
    excellent: 80,
    good: 60,
  },
  overallFeedback: {
    excellent: "Excellent listing quality",
    good: "Good listing quality with room for improvement",
    poor: "Listing needs significant improvement",
  },
}