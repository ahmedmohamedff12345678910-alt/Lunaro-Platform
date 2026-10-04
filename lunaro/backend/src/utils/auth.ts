import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { env } from "../config/env.js";
import type { Role } from "@prisma/client";

export type AuthPayload = { sub: string; role: Role; email: string };

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
}

export const hashPassword = (password: string) => argon2.hash(password);
export const verifyPassword = (hash: string, password: string) => argon2.verify(hash, password);
