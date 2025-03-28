const fs = require('fs');

const ERROR_CATEGORIES = {
  CONFIG: 'Incorrect TypeScript configuration',
  TYPES: 'Missing type definitions',
  IMPORTS: 'Import issues',
  DEPS: 'Outdated dependencies',
  SYNTAX: 'TypeScript syntax errors',
  TYPE_MISMATCH: 'Type compatibility issues',
  GENERICS: 'Generic type errors',
  ASYNC: 'Async/Promise related errors'
};

const TROUBLESHOOTING_STEPS = {
  [ERROR_CATEGORIES.CONFIG]: [
    'Verify tsconfig.json compilerOptions',
    'Check file includes/excludes in config',
    'Validate module resolution strategy'
  ],
  [ERROR_CATEGORIES.TYPES]: [
    'Install @types packages for dependencies',
    'Check type declaration files',
    'Verify type exports in package.json'
  ],
  [ERROR_CATEGORIES.IMPORTS]: [
    'Verify import paths and aliases',
    'Check module resolution settings',
    'Ensure exported types/values match imports'
  ],
  [ERROR_CATEGORIES.DEPS]: [
    'Update TypeScript and related packages',
    'Run pnpm install --latest',
    'Check for breaking changes in updated packages'
  ],
  [ERROR_CATEGORIES.SYNTAX]: [
    'Check for syntax errors in TypeScript code',
    'Verify proper usage of TypeScript features',
    'Review recent code changes'
  ],
  [ERROR_CATEGORIES.TYPE_MISMATCH]: [
    'Check type compatibility between variables',
    'Verify function parameter and return types',
    'Review type assertions and conversions'
  ],
  [ERROR_CATEGORIES.GENERICS]: [
    'Verify generic type parameters',
    'Check generic constraints and defaults',
    'Review generic type inference'
  ],
  [ERROR_CATEGORIES.ASYNC]: [
    'Check Promise handling and async/await usage',
    'Verify return types of async functions',
    'Review error handling in async code'
  ]
};

function analyzeErrors(errorOutput) {
  const errors = errorOutput.split('error TS');
  const categorized = new Map();
  const errorCounts = new Map();

  errors.forEach(error => {
    if (!error.trim()) return;

    let category;
    if (error.includes('Cannot find module') || error.includes('Could not find')) {
      category = ERROR_CATEGORIES.TYPES;
    } else if (error.includes('compiler option') || error.includes('tsconfig')) {
      category = ERROR_CATEGORIES.CONFIG;
    } else if (error.includes('has no exported member') || error.includes('is not exported')) {
      category = ERROR_CATEGORIES.IMPORTS;
    } else if (error.includes('requires types') || error.includes('@types')) {
      category = ERROR_CATEGORIES.DEPS;
    } else if (error.includes('expected') || error.includes('missing')) {
      category = ERROR_CATEGORIES.SYNTAX;
    } else if (error.includes('not assignable') || error.includes('type mismatch')) {
      category = ERROR_CATEGORIES.TYPE_MISMATCH;
    } else if (error.includes('Type parameter') || error.includes('constraint')) {
      category = ERROR_CATEGORIES.GENERICS;
    } else if (error.includes('Promise') || error.includes('async')) {
      category = ERROR_CATEGORIES.ASYNC;
    }

    if (category) {
      if (!categorized.has(category)) {
        categorized.set(category, []);
        errorCounts.set(category, 0);
      }
      categorized.get(category).push(error.trim());
      errorCounts.set(category, errorCounts.get(category) + 1);
    }
  });

  return { categories: Array.from(categorized.keys()), details: categorized, counts: errorCounts };
}

// Read TypeScript output from stdin
let tsOutput = '';
process.stdin.resume();
process.stdin.on('data', data => tsOutput += data);
process.stdin.on('end', () => {
  const { categories, details, counts } = analyzeErrors(tsOutput);
  
  console.log('\n\x1b[31mType Check Failed\x1b[0m');
  
  // Summary of error distribution
  console.log('\n\x1b[35mError Distribution:\x1b[0m');
  categories.forEach(category => {
    const count = counts.get(category);
    const percentage = Math.round((count / Array.from(counts.values()).reduce((a, b) => a + b, 0)) * 100);
    console.log(`  ${category}: ${count} errors (${percentage}%)`);
  });

  console.log('\n\x1b[33mPotential Causes:\x1b[0m');
  categories.forEach((cause, i) => {
    console.log(`\n  ${i + 1}. ${cause}`);
    // Show first error example for each category
    const firstError = details.get(cause)[0];
    if (firstError) {
      console.log(`     Example: ${firstError.split('\n')[0]}`);
    }
  });

  console.log('\n\x1b[36mTroubleshooting Steps:\x1b[0m');
  categories.forEach(cause => {
    console.log(`\n  For ${cause}:`);
    TROUBLESHOOTING_STEPS[cause].forEach((step, i) =>
      console.log(`    › ${step}`));
  });
  
  process.exit(1);
});