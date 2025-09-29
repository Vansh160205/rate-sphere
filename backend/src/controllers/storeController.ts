import { Request, Response } from "express";
import * as storeService from "../services/storeService";
import { validationResult } from "express-validator";

export async function createStore(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const store = await storeService.createStore(req.body);
    return res.status(201).json(store);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}
export async function getStores(req: Request, res: Response) {
  try {
    console.log('getStores called with query:', req.query);
    console.log('User:', (req as any).user);
    
    const { name, address } = req.query;
    const stores = await storeService.getStores(name as string, address as string);
    
    console.log('Stores fetched:', stores);
    
    // Return in the format expected by frontend
    return res.json({
      stores: stores || [],
      userRatings: [] // TODO: Implement user ratings fetching
    });
  } catch (error: any) {
    console.error('Error in getStores:', error);
    return res.status(500).json({ message: error.message });
  }
}
export async function getStoreById(req: Request, res: Response) {
  try {
    const store = await storeService.getStoreById(Number(req.params.id));
    if (!store) return res.status(404).json({ message: "Store not found" });
    return res.json(store);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getStoreByOwnerId(req: Request, res: Response) {
  try {
    const store = await storeService.getStoreByOwnerId(Number(req.params.id));
    console.log("Store fetched by ownerId:", store);
    if (!store) return res.status(404).json({ message: "Store not found" });
    return res.json(store);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateStore(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const store = await storeService.updateStore((req as any).user,Number(req.params.id), req.body);
    console.log("update store: ",store);
    return res.json(store);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteStore(req: Request, res: Response) {
  try {
    await storeService.deleteStore(Number(req.params.id));
    return res.json({ message: "Store deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}
