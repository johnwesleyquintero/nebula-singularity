import { DatabaseError, ValidationError } from "@/lib/error";
import { supabase } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new ValidationError({
        marketplaces: ["At least one marketplace must be selected"],
      });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 400 },
      );
    }

    // Create the user profile in the users table
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email,
        name,
        role: role || "seller",
      },
    ]);

    if (profileError) {
      // Clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);

      throw new DatabaseError("Failed to create user account");
    }

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
