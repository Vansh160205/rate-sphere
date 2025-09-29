import { body } from "express-validator";

export const updateUserValidator = [
  body("name").optional().isLength({ min: 3, max: 60 }),
  body("email").optional().isEmail(),
  body("password").optional().isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minSymbols: 1,
  }),
  body("address").optional().isLength({ max: 400 }),
];

export const updatePasswordValidator = [
  body("oldPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("Old password must be 8-16 characters"),
  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("New password must be 8-16 characters")
    .matches(/[A-Z]/)
    .withMessage("New password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*]/)
    .withMessage("New password must contain at least one special character"),
];
