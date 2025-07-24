import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, branch, rating, valuableTopic, feedbackComments } = body

    console.log("Received feedback submission:", { name, branch, rating })

    // Validate required fields
    if (!branch || !rating) {
      return NextResponse.json({ error: "Branch and rating are required" }, { status: 400 })
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Insert feedback into database using Prisma
    const result = await prisma.feedback.create({
      data: {
        name: name || null,
        branch,
        rating,
        valuableTopic: valuableTopic || null,
        feedbackComments: feedbackComments || null,
      },
      select: {
        id: true,
        createdAt: true,
      },
    })

    console.log("Successfully inserted feedback with ID:", result.id)

    return NextResponse.json({
      success: true,
      id: result.id,
      created_at: result.createdAt,
    })
  } catch (error) {
    console.error("Detailed error submitting feedback:", error)

    return NextResponse.json(
      {
        error: "Failed to submit feedback",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
