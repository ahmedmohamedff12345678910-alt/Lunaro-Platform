import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export class AppError extends Error { constructor(public statusCode:number, message:string) { super(message); this.name="AppError"; } }
export const notFound: RequestHandler = (_req,res) => res.status(404).json({ success:false, message:"Route not found" });
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) return res.status(400).json({ success:false, message:"Validation failed", errors:error.issues });
  if (error instanceof AppError) return res.status(error.statusCode).json({ success:false, message:error.message });
  console.error(error);
  return res.status(500).json({ success:false, message:"Internal server error" });
};
