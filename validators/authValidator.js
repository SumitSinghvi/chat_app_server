import { body } from 'express-validator';

const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('phone').isMobilePhone().withMessage('Phone number is invalid'),
  body('role').isIn(['Teacher', 'Student', 'Institute']).withMessage('Role is invalid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateUpdate = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('phone').isMobilePhone().withMessage('Phone number is invalid'),
    body('role').isIn(['Teacher', 'Student', 'Institute']).withMessage('Role is invalid')
  ];

export { validateRegister, validateLogin, validateUpdate };
