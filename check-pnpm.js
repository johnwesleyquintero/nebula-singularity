if (process.env.npm_execpath.indexOf('pnpm') === -1) {
  console.error('\x1b[31m⚠️  This repository requires using pnpm as the package manager.\x1b[0m');
  process.exit(1);
}