#!/usr/bin/env node

const { execSync } = require('node:child_process');

const SCHEMA_PATH = 'api-gateway/prisma/schema.prisma';
const MIGRATIONS_PATH = 'api-gateway/prisma/migrations';
const GENERATED_PATHS = [];

const RELEVANT_PATHS = [SCHEMA_PATH, MIGRATIONS_PATH, ...GENERATED_PATHS];

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function stagedFiles() {
  const output = run('git diff --cached --name-only --diff-filter=ACMR');
  return output ? output.split('\n') : [];
}

function hasStagedSchemaChange(files) {
  return files.includes(SCHEMA_PATH);
}

function hasStagedMigration(files) {
  return files.some((file) => file.startsWith(`${MIGRATIONS_PATH}/`));
}

function unstagedRelevantFiles() {
  const quotedPaths = RELEVANT_PATHS.map((p) => `"${p}"`).join(' ');
  const output = run(`git diff --name-only -- ${quotedPaths}`);
  return output ? output.split('\n') : [];
}

function stageRelevantFiles() {
  const quotedPaths = RELEVANT_PATHS.map((p) => `"${p}"`).join(' ');
  execSync(`git add ${quotedPaths}`, { stdio: 'inherit' });
}

function main() {
  const files = stagedFiles();

  if (!hasStagedSchemaChange(files)) {
    process.exit(0);
  }

  console.log('Prisma schema change detected. Running prisma generate...');
  execSync(`npx prisma generate --schema ${SCHEMA_PATH}`, {
    stdio: 'inherit',
  });

  const migrationStaged = hasStagedMigration(files);

  if (!migrationStaged) {
    console.error(
      '\nPrisma schema is staged but no migration files are staged.\n' +
        'Run:\n' +
        `  npx prisma migrate dev --schema ${SCHEMA_PATH} --name <migration_name>\n` +
        'Then stage the generated migration files and commit again.\n',
    );
    process.exit(1);
  }

  const changedRelevantFiles = unstagedRelevantFiles();

  if (changedRelevantFiles.length > 0) {
    console.log(
      '\nPrisma-related files changed during generate. Staging them for you...',
    );
    stageRelevantFiles();

    console.error(
      '\nGenerated Prisma-related changes were staged for you.\n' +
        'Please review them and run git commit again.\n',
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
