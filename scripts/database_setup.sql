-- Database setup for PhotoMatch platform
-- This script creates the necessary tables for the application

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'ended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Photos table
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Create face_encodings table
CREATE TABLE IF NOT EXISTS face_encodings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    encoding_data JSONB NOT NULL, -- Store face encoding as JSON array
    face_location JSONB NOT NULL, -- Store face bounding box coordinates
    confidence FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Photo_interactions table (likes, views, etc.)
CREATE TABLE IF NOT EXISTS photo_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('like', 'view', 'download')),
    user_identifier VARCHAR(255), -- Could be IP, session ID, or user ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_code ON events(code);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_photos_event_id ON photos(event_id);
CREATE INDEX IF NOT EXISTS idx_photos_processing_status ON photos(processing_status);
CREATE INDEX IF NOT EXISTS idx_face_encodings_photo_id ON face_encodings(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_interactions_photo_id ON photo_interactions(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_interactions_type ON photo_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_comments_photo_id ON comments(photo_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for events table
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO events (name, code, date, location, description, status) VALUES
('Sarah & John''s Wedding', 'WEDDING2024', '2024-06-15', 'Sunset Gardens', 'Beautiful wedding celebration', 'active'),
('College Reunion 2024', 'REUNION24', '2024-07-20', 'University Campus', 'Annual college reunion', 'active'),
('Birthday Party', 'BDAY2024', '2024-08-10', 'Community Center', 'Surprise birthday celebration', 'draft');

-- Create a view for event statistics
CREATE OR REPLACE VIEW event_stats AS
SELECT 
    e.id,
    e.name,
    e.code,
    e.date,
    e.location,
    e.status,
    COUNT(DISTINCT p.id) as total_photos,
    COUNT(DISTINCT fe.id) as total_faces,
    COUNT(DISTINCT pi.id) FILTER (WHERE pi.interaction_type = 'view') as total_views,
    COUNT(DISTINCT pi.id) FILTER (WHERE pi.interaction_type = 'like') as total_likes,
    COUNT(DISTINCT c.id) as total_comments
FROM events e
LEFT JOIN photos p ON e.id = p.event_id
LEFT JOIN face_encodings fe ON p.id = fe.photo_id
LEFT JOIN photo_interactions pi ON p.id = pi.photo_id
LEFT JOIN comments c ON p.id = c.photo_id
GROUP BY e.id, e.name, e.code, e.date, e.location, e.status;
