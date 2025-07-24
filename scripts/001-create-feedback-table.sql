-- Drop table if exists (for development purposes)
-- DROP TABLE IF EXISTS feedback;

-- Create feedback table with proper constraints
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  branch VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  valuable_topic TEXT,
  feedback_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_branch ON feedback(branch);

-- Insert a sample record to test the table (optional)
INSERT INTO feedback (name, branch, rating, valuable_topic, feedback_comments) 
VALUES ('Test User', 'Computer Science', 5, 'Spring Boot', 'Great training program!')
ON CONFLICT DO NOTHING;

-- Verify table creation
SELECT COUNT(*) as total_records FROM feedback;
