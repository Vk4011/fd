import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
  try {
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

    // Fetch all feedback data
    const result = await sql`
      SELECT id, name, branch, rating, valuable_topic, feedback_comments, created_at
      FROM feedback
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error fetching feedback data:', error)
    
    // Handle specific database errors
    if (error instanceof Error && error.message.includes('relation "feedback" does not exist')) {
      return NextResponse.json(
        { error: 'Database table not found. Please ensure the feedback table exists.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch feedback data' },
      { status: 500 }
    )
  }
}
