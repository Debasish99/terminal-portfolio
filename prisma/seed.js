const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Starting Database Migration & Seeding ---');

  // 1. Create Admin User
  const adminEmail = 'admin@retro.blog';
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log(`[USER] Admin user created/verified: ${admin.email}`);

  // 2. Migrate Posts from JSON
  const jsonPath = path.join(process.cwd(), 'lib', 'posts-db.json');
  if (fs.existsSync(jsonPath)) {
    console.log('[DATA] Found posts-db.json, migrating entries...');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    for (const post of data) {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: {
          title: post.title,
          slug: post.slug,
          content: post.content,
          date: new Date(post.date),
        },
      });
      console.log(`   -> Migrated: ${post.slug}`);
    }
    console.log('[DATA] Migration complete.');
  } else {
    console.log('[DATA] No posts-db.json found. Seeding sample posts...');
    
    // Seed sample posts
    const samplePosts = [
      {
        title: "Why I Love Terminal Interfaces",
        slug: "why-i-love-terminal-interfaces",
        content: "# Why I Love Terminal Interfaces\n\nBecause they make you think.\n\nTerminals remove distractions. They force clarity. They reward precision.\n\nThis blog is inspired by **Linux**, **DOS**, and **old systems**.",
        date: new Date('2024-01-15'),
      },
      {
        title: "Understanding Windows Server Administration",
        slug: "understanding-windows-server-administration",
        content: "# Understanding Windows Server Administration\n\nWindows Server is the backbone of enterprise infrastructure. Key topics include Active Directory, GPO management, server roles, and security hardening.",
        date: new Date('2024-01-10'),
      },
      {
        title: "Azure Infrastructure Best Practices",
        slug: "azure-infrastructure-best-practices",
        content: "# Azure Infrastructure Best Practices\n\nLearn cloud architecture patterns, cost optimization, and security. Topics: IaaS vs PaaS vs SaaS, virtual machine sizing, networking, and cost management.",
        date: new Date('2024-01-05'),
      },
      {
        title: "Linux Kernel Deep Dive",
        slug: "linux-kernel-deep-dive",
        content: "# Linux Kernel Deep Dive\n\nExploring the internals of the Linux kernel from process management and memory allocation to interrupt handling and system calls.",
        date: new Date('2024-01-03'),
      },
      {
        title: "Networking Fundamentals for Cloud Engineers",
        slug: "networking-fundamentals-cloud-engineers",
        content: "# Networking Fundamentals for Cloud Engineers\n\nUnderstanding networking crucial for cloud infrastructure. OSI model, TCP/IP, DNS, VPC, and load balancing strategies.",
        date: new Date('2023-12-28'),
      },
      {
        title: "Security Hardening for Linux Systems",
        slug: "security-hardening-linux-systems",
        content: "# Security Hardening for Linux Systems\n\nComprehensive guide to securing your Linux systems. User permissions, SSH hardening, firewall, SELinux, and patching.",
        date: new Date('2023-12-25'),
      },
      {
        title: "Docker Containerization Best Practices",
        slug: "docker-containerization-best-practices",
        content: "# Docker Containerization Best Practices\n\nBuild, manage, and deploy Docker containers efficiently. Dockerfile optimization, networking, volumes, and CI/CD integration.",
        date: new Date('2023-12-20'),
      },
      {
        title: "Kubernetes Orchestration Essentials",
        slug: "kubernetes-orchestration-essentials",
        content: "# Kubernetes Orchestration Essentials\n\nMaster Kubernetes for container orchestration. Pods, services, deployments, StatefulSets, networking, and resource management.",
        date: new Date('2023-12-15'),
      },
      {
        title: "Infrastructure as Code with Terraform",
        slug: "infrastructure-as-code-terraform",
        content: "# Infrastructure as Code with Terraform\n\nAutomate infrastructure provisioning. HCL syntax, providers, state management, modules, and best practices.",
        date: new Date('2023-12-10'),
      },
      {
        title: "Monitoring and Observability in Production",
        slug: "monitoring-observability-production",
        content: "# Monitoring and Observability in Production\n\nImplement comprehensive monitoring. Prometheus, ELK stack, distributed tracing, and alerting strategies.",
        date: new Date('2023-12-05'),
      },
      {
        title: "Database Performance Tuning",
        slug: "database-performance-tuning",
        content: "# Database Performance Tuning\n\nOptimize database performance. Query optimization, indexing, connection pooling, caching, and replication.",
        date: new Date('2023-11-30'),
      },
      {
        title: "Disaster Recovery and Business Continuity",
        slug: "disaster-recovery-business-continuity",
        content: "# Disaster Recovery and Business Continuity\n\nImplement disaster recovery strategies. RTO and RPO, backup strategies, geographic redundancy, and failover.",
        date: new Date('2023-11-25'),
      },
      {
        title: "DevOps Culture and Practices",
        slug: "devops-culture-practices",
        content: "# DevOps Culture and Practices\n\nUnderstand DevOps principles. CI/CD, automation, monitoring, collaboration, and continuous improvement.",
        date: new Date('2023-11-20'),
      },
    ];

    for (const post of samplePosts) {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: post,
      });
      console.log(`   -> Created: ${post.slug}`);
    }
    console.log('[DATA] Sample posts seeded.');
  }

  console.log('--- Setup Finished ---');
  console.log('Login Email: admin@retro.blog');
  console.log('Login Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
