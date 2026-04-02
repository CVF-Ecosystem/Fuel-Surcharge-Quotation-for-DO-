import { z } from "zod";
import express from "express";

export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const FallbackSchema = z.object({
  price: z.coerce.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export const CrudArraySchema = z.array(z.record(z.string(), z.unknown()));

export function validateBody<T>(
  schema: z.ZodType<T>,
  body: unknown,
  res: express.Response
): T | null {
  const result = schema.safeParse(body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid request body",
      errors: result.error.flatten(),
    });
    return null;
  }
  return result.data;
}
