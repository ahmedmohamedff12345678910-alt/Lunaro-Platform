import type { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../config/db.js";
import { AppError } from "../middleware/error.js";
import { createHash, randomBytes } from "node:crypto";
import { hashPassword, signToken, verifyPassword } from "../utils/auth.js";
import { sendVerificationEmail } from "../utils/email.js";
import { env } from "../config/env.js";
import { clearAuthCookie, setAuthCookie } from "../utils/http.js";

const registerSchema = z.object({ name:z.string().trim().min(2).max(80), email:z.string().email().max(160), password:z.string().min(8).max(128) });
const loginSchema = z.object({ email:z.string().email(), password:z.string().min(1) });

export const register: RequestHandler = async (req,res,next) => { try {
  const data=registerSchema.parse(req.body); const email=data.email.toLowerCase();
  const exists=await prisma.user.findUnique({where:{email}}); if(exists) throw new AppError(409,"An account with this email already exists");
  const user=await prisma.user.create({data:{name:data.name,email,passwordHash:await hashPassword(data.password)},select:{id:true,name:true,email:true,role:true}});
  const rawToken=randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({data:{userId:user.id,tokenHash:createHash("sha256").update(rawToken).digest("hex"),expiresAt:new Date(Date.now()+30*60*1000)}});
  await sendVerificationEmail({email:user.email,name:user.name,url:`${env.PUBLIC_API_URL}/api/auth/verify-email?token=${rawToken}`});
  res.status(201).json({success:true,message:"Account created. Check your email to verify the account."});
} catch(e){next(e);} };

export const login: RequestHandler = async (req,res,next) => { try {
  const data=loginSchema.parse(req.body); const user=await prisma.user.findUnique({where:{email:data.email.toLowerCase()}});
  if(!user || !(await verifyPassword(user.passwordHash,data.password))) throw new AppError(401,"Invalid email or password");
  if(!user.emailVerified) throw new AppError(403,"Email verification required");
  setAuthCookie(res,signToken({sub:user.id,email:user.email,role:user.role})); res.json({success:true,user:{id:user.id,name:user.name,email:user.email,role:user.role}});
} catch(e){next(e);} };

export const verifyEmail: RequestHandler = async (req,res,next) => { try {
  const token=z.string().min(32).parse(req.query.token);
  const tokenHash=createHash("sha256").update(token).digest("hex");
  const record=await prisma.emailVerificationToken.findUnique({where:{tokenHash}});
  if(!record || record.expiresAt < new Date()) throw new AppError(400,"Verification link is invalid or expired");
  await prisma.$transaction([prisma.user.update({where:{id:record.userId},data:{emailVerified:true}}),prisma.emailVerificationToken.delete({where:{id:record.id}})]);
  res.redirect(`${env.FRONTEND_URL}/verify-email?verified=1`);
} catch(e){next(e);} };

export const logout: RequestHandler = (_req,res) => { clearAuthCookie(res); res.json({success:true}); };
export const me: RequestHandler = async (req,res,next) => { try { if(!req.user) throw new AppError(401,"Authentication required"); res.json({success:true,user:req.user}); } catch(e){next(e);} };
