import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Testing database connection...")
    
    // Test basic connection
    const result = await sql`SELECT NOW() as current_time, 'Database connected!' as message`
    
    console.log("Database connection successful:", result[0])
    
    return Response.json({
      success: true,
      message: "Database connection successful",
      timestamp: result[0].current_time,
      data: result[0]
    })
  } catch (error) {
    console.error("Database connection failed:", error)
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}