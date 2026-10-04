import type { RequestHandler } from "express";
import { prisma } from "../config/db.js";
import { AUTH_COOKIE } from "../utils/http.js";
import { verifyToken } from "../utils/auth.js";
import { AppError } from "./error.js";
import type { Role } from "@prisma/client";

declare global { namespace Express { interface Request { user?: { id:string; email:string; role:Role; name:string } } } }

export const requireAuth: RequestHandler = async (req,_res,next) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE];
    if (!token) throw new AppError(401,"Authentication required");
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where:{ id:payload.sub }, select:{ id:true,email:true,role:true,name:true,emailVerified:true } });
    if (!user) throw new AppError(401,"Invalid authentication session");
    if (!user.emailVerified) throw new AppError(403,"Email verification required");
    req.user = { id:user.id,email:user.email,role:user.role,name:user.name };
    next();
  } catch (error) { next(error); }
};

export const requireRoles = (...roles: Role[]): RequestHandler => (req,_res,next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new AppError(403,"Insufficient permissions"));
  next();
};
