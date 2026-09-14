import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";

// Parse DATABASE_URL untuk membuat pool koneksi MariaDB
// Format: mysql://user:password@host:port/database
function createPool() {
  const url = new URL(process.env.DATABASE_URL!);
  return mariadb.createPool({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // hapus leading "/"
    connectionLimit: 5,
  });
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter: new PrismaMariaDb(createPool()),
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
