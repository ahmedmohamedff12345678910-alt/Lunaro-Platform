import type { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../config/db.js";
import { sendContactNotification } from "../utils/email.js";

const schema=z.object({name:z.string().trim().min(2).max(100),email:z.string().email().max(160),company:z.string().trim().max(120).optional(),phone:z.string().trim().max(40).optional(),service:z.string().trim().max(120).optional(),budget:z.string().trim().max(80).optional(),message:z.string().trim().min(10).max(5000)});
export const createContact:RequestHandler=async(req,res,next)=>{try{const data=schema.parse(req.body);const item=await prisma.contactMessage.create({data});try{await sendContactNotification(data);}catch(emailError){console.error("Contact email failed",emailError);}res.status(201).json({success:true,message:"Your inquiry was received successfully",id:item.id});}catch(e){next(e)}};
export const listContacts:RequestHandler=async(_req,res,next)=>{try{const items=await prisma.contactMessage.findMany({orderBy:{createdAt:"desc"}});res.json({success:true,items});}catch(e){next(e)}};
export const updateContact:RequestHandler=async(req,res,next)=>{try{const id=z.string().cuid().parse(req.params.id);const status=z.enum(["NEW","READ","REPLIED","ARCHIVED"]).parse(req.body.status);const item=await prisma.contactMessage.update({where:{id},data:{status}});res.json({success:true,item});}catch(e){next(e)}};
