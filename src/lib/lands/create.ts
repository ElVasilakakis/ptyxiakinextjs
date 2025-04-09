// lib/actions.ts
"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db"; // Assuming you have a Prisma client setup
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Lands } from "@prisma/client";

// Schema for validating land data
const landSchema = z.object({
  landName: z.string().min(2, {
    message: "Land name must be at least 2 characters.",
  }),
  location: z.any().optional(),
  color: z.string().optional(),
  enabled: z.boolean().default(true),
});

// Type for the return value of our actions
type ActionResult = {
    success: boolean;
    message?: string;
    data?: Lands;
    error?: string;
};

/**
 * Create a new land
 */
export async function createLand(formData: z.infer<typeof landSchema>): Promise<ActionResult> {
  try {
    // Validate the form data
    const validatedFields = landSchema.safeParse(formData);
    
    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data. Please check your inputs.",
      };
    }

    // Get the current user
    const session = await getServerSession(authOptions);
    console.log(session?.user.id)
    if (!session || !session.user || !session.user.id) {
       
      return {
        success: false,
        error: "You must be logged in to create a land.",
      };
    }

    // Create the land in the database
    const land = await db.lands.create({
      data: {
        userId: session.user.id,
        landName: validatedFields.data.landName,
        location: validatedFields.data.location,
        color: validatedFields.data.color,
        enabled: validatedFields.data.enabled,
      },
    });

    // Revalidate the lands page to show the new land
    revalidatePath("/lands");
    
    return {
      success: true,
      message: "Land created successfully!",
      data: JSON.parse(JSON.stringify(land)),
    };
  } catch (error) {
    console.error("Error creating land:", error);
    return {
      success: false,
      error: "Failed to create land. Please try again.",
    };
  }
}

/**
 * Update an existing land
 */
export async function updateLand(
  landId: string,
  formData: z.infer<typeof landSchema>
): Promise<ActionResult> {
  try {
    // Validate the form data
    const validatedFields = landSchema.safeParse(formData);
    
    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data. Please check your inputs.",
      };
    }

    // Get the current user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.email || !session.user.id) {
      return {
        success: false,
        error: "You must be logged in to update a land.",
      };
    }

    // Find the land and verify ownership
    const existingLand = await db.lands.findUnique({
      where: { id: landId },
    });

    if (!existingLand) {
      return {
        success: false,
        error: "Land not found.",
      };
    }

    if (existingLand.userId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to update this land.",
      };
    }

    // Update the land
    const updatedLand = await db.lands.update({
      where: { id: landId },
      data: {
        landName: validatedFields.data.landName,
        location: validatedFields.data.location,
        color: validatedFields.data.color,
        enabled: validatedFields.data.enabled,
      },
    });

    // Revalidate the lands page to show the updated land
    revalidatePath("/lands");
    revalidatePath(`/lands/${landId}`);
    
    return {
      success: true,
      message: "Land updated successfully!",
      data: JSON.parse(JSON.stringify(updatedLand)),
    };
  } catch (error) {
    console.error("Error updating land:", error);
    return {
      success: false,
      error: "Failed to update land. Please try again.",
    };
  }
}

/**
 * Delete a land
 */
export async function deleteLand(landId: string): Promise<ActionResult> {
  try {
    // Get the current user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        error: "You must be logged in to delete a land.",
      };
    }

    // Find the land and verify ownership
    const existingLand = await db.lands.findUnique({
      where: { id: landId },
    });

    if (!existingLand) {
      return {
        success: false,
        error: "Land not found.",
      };
    }

    if (existingLand.userId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to delete this land.",
      };
    }

    // Check if the land has any devices
    const devicesCount = await db.devices.count({
      where: { landId },
    });

    if (devicesCount > 0) {
      return {
        success: false,
        error: "Cannot delete land with associated devices. Please remove all devices first.",
      };
    }

    // Delete the land
    await db.lands.delete({
      where: { id: landId },
    });

    // Revalidate the lands page
    revalidatePath("/lands");
    
    return {
      success: true,
      message: "Land deleted successfully!",
    };
  } catch (error) {
    console.error("Error deleting land:", error);
    return {
      success: false,
      error: "Failed to delete land. Please try again.",
    };
  }
}

/**
 * Get all lands for the current user
 */
export async function getLands(): Promise<ActionResult> {
  try {
    // Get the current user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        error: "You must be logged in to view lands.",
      };
    }

    // Get all lands for the user
    const lands = await db.lands.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(lands)),
    };
  } catch (error) {
    console.error("Error fetching lands:", error);
    return {
      success: false,
      error: "Failed to fetch lands. Please try again.",
    };
  }
}

/**
 * Get a single land by ID
 */
export async function getLand(landId: string): Promise<ActionResult> {
  try {
    // Get the current user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        error: "You must be logged in to view land details.",
      };
    }

    // Get the land
    const land = await db.lands.findUnique({
      where: { id: landId },
      include: {
        Devices: true, // Include associated devices
      },
    });

    if (!land) {
      return {
        success: false,
        error: "Land not found.",
      };
    }

    // Check if the user owns this land
    if (land.userId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to view this land.",
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(land)),
    };
  } catch (error) {
    console.error("Error fetching land:", error);
    return {
      success: false,
      error: "Failed to fetch land details. Please try again.",
    };
  }
}

/**
 * Toggle land enabled status
 */
export async function toggleLandStatus(landId: string): Promise<ActionResult> {
  try {
    // Get the current user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        error: "You must be logged in to update a land.",
      };
    }

    // Find the land and verify ownership
    const existingLand = await db.lands.findUnique({
      where: { id: landId },
    });

    if (!existingLand) {
      return {
        success: false,
        error: "Land not found.",
      };
    }

    if (existingLand.userId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to update this land.",
      };
    }

    // Toggle the enabled status
    const updatedLand = await db.lands.update({
      where: { id: landId },
      data: {
        enabled: !existingLand.enabled,
      },
    });

    // Revalidate the lands page
    revalidatePath("/lands");
    revalidatePath(`/lands/${landId}`);
    
    return {
      success: true,
      message: `Land ${updatedLand.enabled ? 'enabled' : 'disabled'} successfully!`,
      data: JSON.parse(JSON.stringify(updatedLand)),
    };
  } catch (error) {
    console.error("Error toggling land status:", error);
    return {
      success: false,
      error: "Failed to update land status. Please try again.",
    };
  }
}
