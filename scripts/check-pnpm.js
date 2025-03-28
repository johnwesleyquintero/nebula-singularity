const execPath = process.env.npm_execpath || '';

function printError(message) {
  console.error('\x1b[31m✖ Error:\x1b[0m', message);
}

function printSuccess(message) {
  console.log('\x1b[32m✓\x1b[0m', message);
}

if (!execPath.includes('pnpm')) {
  printError('This project requires pnpm for dependency management');
  console.log('\n\x1b[36mTo fix:\x1b[0m');
  console.log('  1. Install pnpm globally: npm install -g pnpm');
  console.log('  2. Run: pnpm install');
  process.exit(1);
}

const requiredPnpmVersion = '8.15.x';
const currentPnpmVersion = process.env.npm_config_user_agent?.match(/pnpm\/([^\s]+)/)?.[1] || 
  process.env.npm_package_packageManager?.split('@')[1];

if (!currentPnpmVersion) {
  printError('Unable to detect pnpm version');
  console.log('\n\x1b[36mRequired:\x1b[0m', requiredPnpmVersion);
  console.log('\n\x1b[36mTo fix:\x1b[0m');
  console.log('  › Run: pnpm install -g pnpm@8.15.x');
  process.exit(1);
}

function compareVersions(v1, v2) {
  if (v2.endsWith('.x')) {
    const [major1, minor1] = v1.split('.').map(Number);
    const [major2, minor2] = v2.replace('.x', '').split('.').map(Number);
    if (isNaN(major1) || isNaN(minor1) || isNaN(major2) || isNaN(minor2)) {
      return false;
    }
    return major1 === major2 && minor1 === minor2;
  }
  return v1 === v2;
}

if (!compareVersions(currentPnpmVersion, requiredPnpmVersion)) {
  printError(`Project requires pnpm version ${requiredPnpmVersion}`);
  console.log('\n\x1b[33mCurrent version:\x1b[0m', currentPnpmVersion);
  console.log('\n\x1b[36mTo fix:\x1b[0m');
  console.log('  1. Update pnpm: pnpm install -g pnpm@8.15.x');
  console.log('  2. Verify with: pnpm --version');
  process.exit(1);
}

// Success - version matches required version
printSuccess(`Using compatible pnpm version: ${currentPnpmVersion}`);
process.exit(0);