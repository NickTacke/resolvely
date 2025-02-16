// app/api/auth/signup/route.js
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server"; // Import NextResponse for App Router
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json(); // Parse JSON body

    // 1. Basic input validation (you can add more robust validation)
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // 2. Check if user with this email already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 },
      ); // 409 Conflict
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user in database
    const newUser = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        image: `https://ui-avatars.com/api/?background=random&name=${(name as string).replaceAll(" ", "+")}`,
      },
    });

    // 5. Return success response
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { email: newUser.email, name: newUser.name },
      },
      { status: 201 },
    ); // 201 Created
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { message: "Something went wrong during signup" },
      { status: 500 },
    ); // 500 Internal Server Error
  }
}
