-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the user_memories table
CREATE TABLE IF NOT EXISTS user_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- The User table is created by Prisma, so its id is likely TEXT.
    -- If it's actually UUID in your database, change TEXT to UUID below.
    user_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    -- 1536 dimensions is the default for OpenAI's text-embedding-ada-002 and text-embedding-3-small
    embedding vector(1536)
);

-- Optional: Create an HNSW index for faster similarity search
-- CREATE INDEX user_memories_embedding_idx ON user_memories USING hnsw (embedding vector_cosine_ops);
