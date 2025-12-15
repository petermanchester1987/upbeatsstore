//THIS IS THE ZOD VALIDATOR FOLDER

import { z } from "zod";
import {formatNumberWithDecimal} from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly two decimal places'
  );

// Define the scheme for inserting products
export const insertProductSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    category: z.string().min(3, "Category must be at least 3 characters"),
    brand: z.string().min(3, "Brand must be at least 2 characters"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    stock: z.coerce.number().min(0, "Stock must be a positive number"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency
})

// Schema for signing users in 

export const signInFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

// Schema for signing up a user

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

  //Cart schemas
export const cartItemSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    qty: z.number().int().nonnegative("Quantity must be a positive number"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(1, "Slug is required"),
    image: z.string().min(1, "Image is required"),
    price: currency,
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema).min(1, "Cart must have at least one item"),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, "Session Cart ID is required"),
    userId: z.string().optional().nullable(),
});