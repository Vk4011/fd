import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, branch, rating, valuableTopic, feedbackComments } = body

    // Validate required fields
    if (!branch || !rating) {
      return NextResponse.json(
        { error: 'Branch and rating are required' },
        { status: 400 }
      )
    }

    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json(
        { error: 'Database URL not configured' },
        { status: 500 }
      )
    }

    // Create database connection
    const sql = neon(databaseUrl)

    // Insert feedback into database
    const result = await sql`
      INSERT INTO feedback (name, branch, rating, valuable_topic, feedback_comments, created_at)
      VALUES (${name || null}, ${branch}, ${rating}, ${valuableTopic || null}, ${feedbackComments || null}, NOW())
      RETURNING id, created_at
    `

    return NextResponse.json({
      success: true,
      data: {
        id: result[0].id,
        createdAt: result[0].created_at
      }
    })

  } catch (error) {
    console.error('Error submitting feedback:', error)
    
    // Handle specific database errors
    if (error instanceof Error && error.message.includes('relation "feedback" does not exist')) {
      return NextResponse.json(
        { error: 'Database table not found. Please ensure the feedback table exists.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
