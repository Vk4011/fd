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

    // Test database connection by getting feedback count
    const result = await sql`SELECT COUNT(*) as count FROM feedback`
    const count = result[0].count

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      feedbackCount: parseInt(count),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    // Handle specific database errors
    if (error instanceof Error && error.message.includes('relation "feedback" does not exist')) {
      return NextResponse.json(
        { 
          status: 'unhealthy',
          database: 'table_missing',
          error: 'Feedback table does not exist',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        status: 'unhealthy',
        database: 'disconnected',
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
