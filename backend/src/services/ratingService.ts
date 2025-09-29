import prisma from "../config/db";
import { RatingCreateInput, RatingUpdateInput } from "../types/ratingTypes";
import { updateStoreRatingStats } from "./ratingCalculationService";

/**
 * Create a rating
 * Only USER can call this
 */
export async function  createRating(user: any, data: RatingCreateInput) {
  const store = await prisma.store.findUnique({ where: { id: data.storeId } });
  if (!store) throw new Error("Store not found");

  // Check if user already rated this store
  const existing = await prisma.rating.findFirst({
    where: { userId: user.id, storeId: data.storeId },
  });
  if (existing) throw new Error("You have already rated this store");

  const rating= await prisma.rating.create({
    data: {
      value: data.value,
      storeId: data.storeId,
      userId: user.id,
    },
  });

  // Update store rating statistics
    await updateStoreRatingStats(data.storeId);
    return rating;
}

/**
 * Update rating
 * Only USER can update their own rating
 */
export async function updateRating(user: any, ratingId: number, data: RatingUpdateInput) {
  const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
  if (!rating) throw new Error("Rating not found");
  if (rating.userId !== user.id) throw new Error("You can only update your own rating");
  // Update the rating
  const updatedRating = await prisma.rating.update({ 
    where: { id: ratingId }, 
    data 
  });

  // Update store rating statistics
  await updateStoreRatingStats(rating.storeId);
  return updatedRating;
}

/**
 * Get all ratings for a store
 * Only STORE_OWNER (for own store) or ADMIN
 */
export async function getRatingsByStore(user: any, storeId: number) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new Error("Store not found");

  if (user.role === "STORE_OWNER" && store.ownerId !== user.id) {
    throw new Error("You can only view ratings for your own store");
  }

  return prisma.rating.findMany({
    where: { storeId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}
