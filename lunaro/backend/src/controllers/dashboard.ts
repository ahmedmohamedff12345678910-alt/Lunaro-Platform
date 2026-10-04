import type { RequestHandler } from "express";
import { prisma } from "../config/db.js";
export const metrics:RequestHandler=async(_req,res,next)=>{try{const [users,services,projects,messages,newMessages]=await Promise.all([prisma.user.count(),prisma.service.count({where:{active:true}}),prisma.project.count({where:{active:true}}),prisma.contactMessage.count(),prisma.contactMessage.count({where:{status:"NEW"}})]);res.json({success:true,metrics:{users,services,projects,messages,newMessages}});}catch(e){next(e)}};
