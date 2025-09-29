// services/ratingCalculationService.ts
import prisma from "../config/db";

/**
 * Calculate and update store rating statistics
 */
export async function updateStoreRatingStats(storeId: number) {
  const ratings = await prisma.rating.findMany({
    where: { storeId },
    select: { value: true }
  });

  const totalRatings = ratings.length;
  let avgRating = 0;

  if (totalRatings > 0) {
    const sumRatings = ratings.reduce((sum, r) => sum + r.value, 0);
    avgRating = Math.round((sumRatings / totalRatings) * 100) / 100; // rounded
  }

  await prisma.store.update({
    where: { id: storeId },
    data: {
      avgRating,
      totalRatings,
    },
  });

  return { avgRating, totalRatings }
}

/**
 * Batch update rating stats for multiple stores
 */
export async function updateMultipleStoreRatingStats(storeIds: number[]) {
  const results = [];
  
  for (const storeId of storeIds) {
    try {
      const stats = await updateStoreRatingStats(storeId);
      results.push({ storeId, ...stats });
    } catch (error) {
      console.error(`Failed to update stats for store ${storeId}:`, error);
      results.push({ 
        storeId, 
        error: typeof error === "object" && error !== null && "message" in error ? (error as any).message : String(error) 
      });
    }
  }
  
  return results;
}