-- Fixr. Supabase Schema Migration
-- Paste this script into your Supabase SQL Editor

CREATE TABLE "Hotel" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "ownerEmail" TEXT UNIQUE NOT NULL,
    "ownerPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "Room" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "hotelId" UUID NOT NULL REFERENCES "Hotel"("id") ON DELETE CASCADE,
    "roomNumber" TEXT NOT NULL,
    "qrCode" TEXT
);

CREATE TABLE "Staff" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "hotelId" UUID NOT NULL REFERENCES "Hotel"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

CREATE TABLE "Complaint" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "hotelId" UUID NOT NULL REFERENCES "Hotel"("id") ON DELETE CASCADE,
    "room" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "guestName" TEXT,
    "status" TEXT DEFAULT 'New',
    "aiSuggestion" TEXT,
    "staffAction" TEXT,
    "staffId" UUID REFERENCES "Staff"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "resolvedAt" TIMESTAMPTZ
);

-- Note: Because we are using the Next.js API Routes with the Service Role Key to bypass RLS initially,
-- you do not strictly need to enable Row Level Security (RLS) policies unless you plan to query directly from the browser later.
