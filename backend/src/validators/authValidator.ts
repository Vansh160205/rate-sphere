import { body } from "express-validator";

export const signupValidator = [
  body('name')
    .isLength({ min: 3, max: 60 })
    .withMessage('Name must be between 3 and 60 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
];


export const loginValidator = [
  body("email").isEmail(),
  body("password").notEmpty(),
];
