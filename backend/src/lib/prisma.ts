import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function loadRootEnv() {
  const cwd = process.cwd();
  const candidates = [
    cwd,
    path.join(cwd, ".."),
    path.resolve(cwd, ".."),
  ];

  for (const root of candidates) {
    if (
      existsSync(path.join(root, ".env")) ||
      existsSync(path.join(root, ".env.local")) ||
      existsSync(path.join(root, ".env.production"))
    ) {
      loadEnvConfig(root);
      if (process.env.DATABASE_URL) return;
    }
  }

  loadEnvConfig(cwd);
  if (!process.env.DATABASE_URL) {
    loadEnvConfig(path.join(cwd, ".."));
  }
}

function createPrismaClient() {
  loadRootEnv();

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to connect to PostgreSQL");
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Lazy proxy so Next.js can import this module during `next build`
 * page-data collection without requiring DATABASE_URL at module evaluation.
 * The client is created on first property access (runtime / SSR).
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
