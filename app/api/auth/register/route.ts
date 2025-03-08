import { NextRequest, NextResponse } from 'next/server';
import { ValidationService } from '@/lib/validation-service';
import { hash } from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validate input data
    const validationResult = ValidationService.validateRegistrationData(data);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    });

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}