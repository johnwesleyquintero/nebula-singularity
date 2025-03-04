# Configuring the Supabase Connection

To connect to the Supabase database in our TypeScript application, follow these steps:

## 1. Install Supabase Client

First, ensure that you have the Supabase client installed in your project. You can do this by running the following command:

```bash
npm install @supabase/supabase-js
```

## 2. Set Up Environment Variables

Create a `.env.local` file in the root of your project (if you haven't already) and add the following environment variables:

```
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

Make sure to replace `https://your-supabase-url.supabase.co` with your actual Supabase URL and `your-supabase-anon-key` with your Supabase anon public key.

## 3. Create Supabase Client

In your TypeScript code, import the Supabase client and create an instance using the environment variables:

```typescript
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
```

## 4. Example Usage

You can now use the `supabase` client to interact with your database. Here are a couple of examples:

### Fetching a User

```typescript
const fetchUser = async (userId: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return data;
};
```

### Inserting a New User

```typescript
const insertUser = async (email: string, password: string) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password }]) // Remember to hash the password before storing
        .single();

    if (error) {
        console.error('Error inserting user:', error);
        return null;
    }

    return data;
};
```

## 5. Security Considerations

*   Ensure that sensitive information, such as the Supabase key, is not exposed in your codebase. Use environment variables to manage these securely.
*   Always hash passwords before storing them in the database for security purposes.
*   Implement Row Level Security (RLS) policies to control data access.

## 6. Performance Considerations

*   Use connection pooling to reuse database connections and reduce latency.
*   Optimize database queries to minimize execution time.
*   Use indexes to speed up data retrieval.

## 7. Error Handling

When interacting with the Supabase client, it's important to handle potential errors gracefully. Here are some best practices:

*   Check the `error` object returned by the Supabase client to see if an error occurred.
*   Log errors to a logging service for monitoring and debugging.
*   Display user-friendly error messages to the user.

By following these steps, you will be able to configure the connection to the Supabase database in our TypeScript application successfully.

---

# Current SQL Query

```sql
-- Create a users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- You may choose to store hashed passwords
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to select their own data
CREATE POLICY "Allow logged-in users to select their own data"
    ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Create a policy to allow users to insert their own data
CREATE POLICY "Allow logged-in users to insert their own data"
    ON users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create a policy to allow users to update their own data
CREATE POLICY "Allow logged-in users to update their own data"
    ON users
    FOR UPDATE
    USING (auth.uid() = id);
