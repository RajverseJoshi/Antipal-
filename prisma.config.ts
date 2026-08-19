import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://mock_user:mock_password@localhost:5432/antipal",
  },
  migrations: {
    path: "prisma/migrations",
  },
});
