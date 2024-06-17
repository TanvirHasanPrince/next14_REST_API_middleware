import User from "@/app/lib/models/user";
import Category from "@/app/lib/models/category";
import { Types } from "mongoose";
import {
  ensureDbConnection,
  handleError,
  handleResponse,
} from "../../../(auth)/users/route";

export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    const { title } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return handleResponse("User Id not valid", null, 404);
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return handleResponse("Category Id not valid", null, 404);
    }

    await ensureDbConnection();

    const user = await User.findById(userId);
    if (!user) {
      return handleResponse("User not found in the database", null, 404);
    }

    const category = await Category.findOne({
      _id: categoryId,
      user: userId,
    });

    if (!category) {
      return handleResponse("Category not found in the database", null, 404);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title: title },
      { new: true }
    );

    return handleResponse("Category updated successfully", updatedCategory);
  } catch (error) {
    return handleError(error, "Error in updating category");
  }
};


export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return handleResponse("User Id not valid", null, 404);
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return handleResponse("Category Id not valid", null, 404);
    }

    await ensureDbConnection();

    const user = await User.findById(userId);
    if (!user) {
      return handleResponse("User not found in the database", null, 404);
    }

    const category = await Category.findOne({
      _id: categoryId,
      user: userId,
    });

    if (!category) {
      return handleResponse("Category not found in the database", null, 404);
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    return handleResponse("Category deleted successfully", deletedCategory);
  } catch (error) {
    return handleError(error, "Error in deleting category");
  }
};