import { body } from "express-validator";

export const createStoreValidator = [
  body("name").isLength({ min: 3, max: 60 }).withMessage("Name must be 3-60 chars"),
  body("email").isEmail().withMessage("Invalid email"),
  body("address").isLength({ max: 400 }).withMessage("Address max 400 chars"),
  body("ownerId").notEmpty().withMessage("ownerId is required"),
];

export const updateStoreValidator = [
  body("name").optional().isLength({ min: 3, max: 60 }),
  body("email").optional().isEmail(),
  body("address").optional().isLength({ max: 400 }),
  body("ownerId").notEmpty().withMessage("ownerId is required"),

];
