-- Add role enum type
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'seller', 'client');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'client';
    END IF;
END $$;

-- Update existing admin users to have admin role
UPDATE profiles 
SET role = 'admin' 
WHERE is_admin = true AND role IS NULL;

-- Update all other users to have client role if no role is set
UPDATE profiles 
SET role = 'client' 
WHERE role IS NULL;

-- Create index on role column for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Add comment to role column
COMMENT ON COLUMN profiles.role IS 'User role: admin, seller, or client';
