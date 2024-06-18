import { Types } from "mongoose";
import {
  ensureDbConnection,
  handleError,
  handleResponse,
} from "../../../(auth)/users/route";
import Blog from "@/app/lib/models/blog";

export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return handleResponse("Blog Id not valid", null, 404);
    }

    await ensureDbConnection();

    const blog = await Blog.findById(blogId)
      .populate("user")
      .populate("category");
    if (!blog) {
      return handleResponse("Blog not found in the database", null, 404);
    }

    return handleResponse("Blog fetched successfully", blog, 200);
  } catch (error) {
    return handleError(error, "Error in fetching the blog");
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return handleResponse("Blog Id not valid", null, 404);
    }

    const { title, description } = await request.json();

    await ensureDbConnection();

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return handleResponse("Blog not found in the database", null, 404);
    }

    if (title) blog.title = title;
    if (description) blog.description = description;

    await blog.save();

    return handleResponse("Blog updated successfully", blog, 200);
  } catch (error) {
    return handleError(error, "Error in updating the blog");
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return handleResponse("Blog Id not valid", null, 404);
    }

    await ensureDbConnection();

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return handleResponse("Blog not found in the database", null, 404);
    }

    return handleResponse("Blog deleted successfully", null, 200);
  } catch (error) {
    return handleError(error, "Error in deleting the blog");
  }
};
