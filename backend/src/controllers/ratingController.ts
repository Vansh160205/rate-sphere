import { Request, Response } from "express";
import * as ratingService from "../services/ratingService";
import { validationResult } from "express-validator";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function createRating(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log('Creating rating with data:', req.body);
    console.log('User:', req.user);
    
    const rating = await ratingService.createRating(req.user, req.body);
    return res.status(201).json(rating);
  } catch (error: any) {
    console.error('Create rating error:', error);
    return res.status(400).json({ message: error.message });
  }
}

export async function updateRating(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const rating = await ratingService.updateRating((req as any).user, Number(req.params.id), req.body);
    res.json(rating);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
}

export async function getRatingsByStore(req: Request, res: Response) {
  try {
    const ratings = await ratingService.getRatingsByStore((req as any).user, Number(req.params.storeId));
    res.json(ratings);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
}
