import type { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../config/db.js";
const schema=z.object({titleAr:z.string().min(2).max(120),titleEn:z.string().min(2).max(120),descriptionAr:z.string().min(5).max(1200),descriptionEn:z.string().min(5).max(1200),imageUrl:z.string().url().optional().or(z.literal("")),projectUrl:z.string().url().optional().or(z.literal("")),technologies:z.array(z.string().min(1).max(40)).max(12),featured:z.boolean().default(true),active:z.boolean().default(true),sortOrder:z.number().int().min(0).default(0)});
export const listPublic:RequestHandler=async(_req,res,next)=>{try{const items=await prisma.project.findMany({where:{active:true},orderBy:{sortOrder:"asc"}});res.json({success:true,items});}catch(e){next(e)}};
export const listAll:RequestHandler=async(_req,res,next)=>{try{const items=await prisma.project.findMany({orderBy:{sortOrder:"asc"}});res.json({success:true,items});}catch(e){next(e)}};
export const create:RequestHandler=async(req,res,next)=>{try{const data=schema.parse(req.body);const item=await prisma.project.create({data});res.status(201).json({success:true,item});}catch(e){next(e)}};
export const update:RequestHandler=async(req,res,next)=>{try{const id=z.string().cuid().parse(req.params.id);const data=schema.partial().parse(req.body);const item=await prisma.project.update({where:{id},data});res.json({success:true,item});}catch(e){next(e)}};
export const remove:RequestHandler=async(req,res,next)=>{try{const id=z.string().cuid().parse(req.params.id);await prisma.project.delete({where:{id}});res.status(204).send();}catch(e){next(e)}};
