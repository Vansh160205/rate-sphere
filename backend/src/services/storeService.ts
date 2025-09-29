import prisma from "../config/db";
import { StoreCreateInput, StoreUpdateInput } from "../types/storeTypes";

/**
 * Create a new store
 * Only admin can call this
 */
export async function createStore(data: StoreCreateInput) {
  // Find the user assigned as owner
  const owner = await prisma.user.findUnique({ where: { id: data.ownerId } });

  if (!owner) {
    throw new Error("Invalid ownerId: user does not exist");
  }

  // If the user is not already a STORE_OWNER, promote them
  if (owner.role !== "STORE_OWNER") {
    await prisma.user.update({
      where: { id: owner.id },
      data: { role: "STORE_OWNER" },
    });
  }

  // Create the store
  return prisma.store.create({ data });
}

/**
 * Get all stores
 * Public users can call this
 */
export async function getStores(name: string,address: string) {
  return prisma.store.findMany({
    where:{
      name:{contains:name||undefined,mode:'insensitive'},
      address:{contains:address||undefined,mode:'insensitive'}},
    include: { 
      owner: { select: { id: true, name: true, email: true } },
      ratings:{
        select:{
        id:true,
        value:true,
        storeId:true
        }
      }
    },
  });
}

export async function getStoreById(id: number) {
  return prisma.store.findUnique({
    where: { id },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
}

export async function getStoreByOwnerId(ownerId: number) {
  console.log("Fetching store for ownerId:", ownerId);
  return prisma.store.findFirst({
    where: { ownerId },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
}

/**
 * Update store details
 * Admin only
 */
export async function updateStore(user:any,id: number, data: StoreUpdateInput) {
    const store = await prisma.store.findUnique({ where: { id } });
    console.log("store to update:",store);
    if (!store) throw new Error("Store not found");
    
    // Only allow STORE_OWNER to update their own store
    // if (user.role === "STORE_OWNER" && store.ownerId !== user.id) {
    //     throw new Error("You can only update your own store");
    // }

    return prisma.store.update({
    where: { id },
    data:{
      name:data.name,
      address:data.address,
      email:data.email,
      ownerId:data.ownerId
    }
  });

}

/**
 * Delete store
 * Admin only
 */
export async function deleteStore(id: number) {
  return prisma.store.delete({ where: { id } });
}
