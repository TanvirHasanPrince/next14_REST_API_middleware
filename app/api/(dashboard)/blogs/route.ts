import User from "@/app/lib/models/user";
import Category from "@/app/lib/models/category";
import { Types } from "mongoose";
import {
  ensureDbConnection,
  handleError,
  handleResponse,
} from "../../(auth)/users/route";
import Blog from "@/app/lib/models/blog";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate") as string;
    const endDate = searchParams.get("endDate") as string;
    const page: any = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return handleResponse("User Id not valid", null, 404);
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return handleResponse("categoryId not valid", null, 404);
    }

    await ensureDbConnection();

    const user = await User.findById(userId);
    if (!user) {
      return handleResponse("User not found in the database", null, 404);
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return handleResponse("Category not found in the database", null, 404);
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    if (searchKeywords) {
      filter.$or = [
        {
          title: { $regex: searchKeywords, $options: "i" },
        },
        {
          description: { $regex: searchKeywords, $options: "i" },
        },
      ];
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(endDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .sort({ createdAt: "asc" })
      .skip(skip)
      .limit(limit);

    return handleResponse("Blogs Fetched successfully", blogs, 200);
  } catch (error) {
    return handleError(error, "Error in fetching blogs");
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const { title, description } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return handleResponse("User Id not valid", null, 404);
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return handleResponse("categoryId not valid", null, 404);
    }

    await ensureDbConnection();

    const user = await User.findById(userId);
    if (!user) {
      return handleResponse("User not found in the database", null, 404);
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return handleResponse("Category not found in the database", null, 404);
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return handleResponse("Blog is successfully created", newBlog, 200);
  } catch (error) {
    return handleError(error, "Error in creating blog");
  }
};
