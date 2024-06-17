import connect from "@/app/lib/db";
import User from "@/app/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

const handleResponse = (
  message: string,
  data: any = null,
  status: number = 200
) => {
  return new NextResponse(JSON.stringify({ message, data }), { status });
};

const handleError = (error: unknown, message: string) => {
  let errorMessage = "Unknown error occurred";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  console.error(message, error);
  return handleResponse(message, { error: errorMessage }, 500);
};

const ensureDbConnection = async () => {
  try {
    await connect();
    console.log("Database connected");
  } catch (error) {
    throw new Error("Failed to connect to the database");
  }
};

export const GET = async () => {
  try {
    await ensureDbConnection();
    const users = await User.find();
    return handleResponse("Fetched users successfully", users);
  } catch (error) {
    return handleError(error, "Error in fetching users");
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await ensureDbConnection();
    const newUser = new User(body);
    await newUser.save();
    return handleResponse("User has been created", newUser);
  } catch (error) {
    return handleError(error, "Error creating user");
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;
    if (!userId || !newUsername) {
      return handleResponse("Id or new username not found", null, 404);
    }

    if (!Types.ObjectId.isValid(userId)) {
      return handleResponse("Invalid user id", null, 400);
    }

    await ensureDbConnection();

    const updatedUser = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return handleResponse("User not found in the database", null, 400);
    }

    return handleResponse("User is updated", updatedUser);
  } catch (error) {
    return handleError(error, "Error updating user");
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return handleResponse("Id not found", null, 400);
    }

    if (!Types.ObjectId.isValid(userId)) {
      return handleResponse("Invalid user id", null, 400);
    }

    await ensureDbConnection();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return handleResponse("User not found in the database", null, 400);
    }

    return handleResponse("User is deleted from the database", deletedUser);
  } catch (error) {
    return handleError(error, "Error deleting user");
  }
};
