import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

/**
 * GET API route to fetch event details by slug
 * @param request - NextRequest object
 * @param context - Route context containing dynamic parameters
 * @returns JSON response with event data or error message
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // Extract slug from dynamic route parameters
    const { slug } = await context.params;

    // Validate slug exists
    if (!slug) {
      return NextResponse.json(
        {
          message: "Slug parameter is required",
        },
        { status: 400 }
      );
    }

    // Validate slug format (URL-friendly: lowercase alphanumeric with hyphens)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          message:
            "Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        {
          message: `Event with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    console.error("Error fetching event by slug:", error);

    // Handle unexpected errors
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

