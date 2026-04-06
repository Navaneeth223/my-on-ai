import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const root = resolve(process.cwd());
const sqlPath = resolve(root, "prisma", "schema.generated.sql");

function run(command) {
  execSync(command, {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
}

async function isDatabaseInitialized() {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRawUnsafe('SELECT 1 FROM "User" LIMIT 1;');
    return true;
  } catch {
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

try {
  if (await isDatabaseInitialized()) {
    process.stdout.write("\nDatabase already appears to be initialized.\n");
    process.exit(0);
  }

  mkdirSync(dirname(sqlPath), { recursive: true });
  const sql = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    {
      cwd: root,
      encoding: "utf8",
      shell: true,
    },
  );

  writeFileSync(sqlPath, sql);
  run(`npx prisma db execute --file "${sqlPath}" --schema prisma/schema.prisma`);
  run("npx prisma generate");
  process.stdout.write("\nDatabase initialized successfully.\n");
} catch (error) {
  const message =
    error && typeof error === "object" && "stderr" in error && error.stderr
      ? String(error.stderr)
      : error instanceof Error
        ? error.message
        : String(error);
  process.stderr.write(`\nDatabase initialization failed.\n${message}\n`);
  process.exit(1);
}
