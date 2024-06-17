import User from "@/app/lib/models/user";
import Category from "@/app/lib/models/category";
import { Types } from "mongoose";
import {
  ensureDbConnection,
  handleError,
  handleResponse,
} from "../../(auth)/users/route";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return handleResponse("User Id not valid", null, 404);
    }

    await ensureDbConnection();

    const user = await User.findById(userId);
    if (!user) {
      return handleResponse("User not found in the database", null, 404);
    }

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return handleResponse("Fetched categories successfully", categories);
  } catch (error) {
    return handleError(error, "Error in fetching category");
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return handleResponse("User Id not valid", null, 404);
    }

    await ensureDbConnection();

    const user = await User.findById(userId);
    if (!user) {
      return handleResponse("User not found in the database", null, 404);
    }

    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return handleResponse("Category is successfully created", newCategory, 200);
  } catch (error) {
    return handleError(error, "Error in creating category");
  }
};

