import "dotenv/config";
import argon2 from "argon2";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL ?? "admin@lunaro.local";
  const password = process.env.SUPER_ADMIN_PASSWORD ?? "ChangeThisImmediately_2026!";
  const passwordHash = await argon2.hash(password);

  await prisma.user.upsert({
    where: { email },
    update: { name: "Lunaro Super Admin", passwordHash, role: Role.SUPER_ADMIN, emailVerified: true },
    create: { email, name: "Lunaro Super Admin", passwordHash, role: Role.SUPER_ADMIN, emailVerified: true }
  });

  const services = [
    ["تطوير المواقع والتطبيقات", "Web & App Development", "نبني منصات ومواقع سريعة وقابلة للتوسع ومصممة حول أهداف نشاطك.", "We build fast, scalable websites and applications around your business goals.", "code-2", 1],
    ["أنظمة الشركات", "Business Systems", "لوحات تحكم وأنظمة داخلية لإدارة العملاء والعمليات والبيانات.", "Dashboards and internal systems for managing customers, operations, and data.", "layout-dashboard", 2],
    ["التجارة الإلكترونية", "E-commerce", "متاجر إلكترونية احترافية مع تجربة شراء واضحة وتجهيزات قابلة للنمو.", "Professional stores with clear purchasing flows and room to scale.", "shopping-bag", 3],
    ["الصيانة والتطوير", "Maintenance & Growth", "تحسين الأداء، إصلاح المشاكل، وإضافة مزايا جديدة بعد الإطلاق.", "Performance improvements, fixes, and new features after launch.", "wrench", 4]
  ] as const;
  for (const [titleAr,titleEn,descriptionAr,descriptionEn,icon,sortOrder] of services) {
    const exists = await prisma.service.findFirst({ where: { titleEn } });
    if (!exists) await prisma.service.create({ data: { titleAr,titleEn,descriptionAr,descriptionEn,icon,sortOrder } });
  }

  const projects = [
    { titleAr:"Lunaro Business", titleEn:"Lunaro Business", descriptionAr:"منصة أعمال رقمية تجمع الخدمات والمشاريع وطلبات العملاء.", descriptionEn:"A digital business platform connecting services, projects, and client inquiries.", technologies:["React","TypeScript","Node.js","PostgreSQL"], sortOrder:1 },
    { titleAr:"Ahmed Cyber Academy", titleEn:"Ahmed Cyber Academy", descriptionAr:"تجربة تعليمية تقنية تركز على البرمجة والأمن السيبراني.", descriptionEn:"A technology learning experience focused on programming and cybersecurity.", technologies:["React","Tailwind","REST API"], sortOrder:2 },
    { titleAr:"Enterprise Dashboard", titleEn:"Enterprise Dashboard", descriptionAr:"لوحة تحكم لإدارة مؤشرات الأداء والعملاء والعمليات.", descriptionEn:"An enterprise dashboard for KPIs, customers, and operational workflows.", technologies:["React","Charts","Express"], sortOrder:3 }
  ];
  for (const project of projects) {
    const exists = await prisma.project.findFirst({ where: { titleEn: project.titleEn } });
    if (!exists) await prisma.project.create({ data: project });
  }
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());
