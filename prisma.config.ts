import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL") || "postgresql://mock_user:mock_password@localhost:5432/antipal",
  },
  migrations: {
    path: "prisma/migrations",
  },
});
