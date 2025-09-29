import { body } from "express-validator";

export const createRatingValidator = [
  body("storeId").isInt().withMessage("storeId must be an integer"),
  body("value")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 and 5"),
];

export const updateRatingValidator = [
  body("value")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 and 5"),
];
