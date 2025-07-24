import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Attempting to fetch feedback data...")

    // Fetch all feedback data ordered by creation date (newest first)
    const result = await prisma.feedback.findMany({
      select: {
        id: true,
        name: true,
        branch: true,
        rating: true,
        valuableTopic: true,
        feedbackComments: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform the data to match the expected format
    const transformedResult = result.map(feedback => ({
      id: feedback.id,
      name: feedback.name,
      branch: feedback.branch,
      rating: feedback.rating,
      valuable_topic: feedback.valuableTopic,
      feedback_comments: feedback.feedbackComments,
      created_at: feedback.createdAt,
    }))

    console.log(`Successfully fetched ${result.length} feedback records`)

    return NextResponse.json(transformedResult, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Detailed error fetching feedback data:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch feedback data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
