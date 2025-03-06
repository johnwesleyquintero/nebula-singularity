# Global Rules

## Table of Contents

- [1. Code Quality](#1-code-quality)
  - [Implementation Checklist](#implementation-checklist)
  - [Naming Conventions](#naming-conventions)
  - [File Structure](#file-structure)
  - [Imports](#imports)
  - [Comments](#comments)
  - [Resources](#resources)
- [2. Security](#2-security)
  - [Implementation Checklist](#implementation-checklist)
  - [Input Validation](#input-validation)
  - [Authentication](#authentication)
  - [Environment Variables](#environment-variables)
  - [CORS (Cross-Origin Resource Sharing)](#cors-cross-origin-resource-sharing)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Resources](#resources)
- [3. Performance](#3-performance)
  - [Implementation Checklist](#implementation-checklist)
  - [Lazy Loading](#lazy-loading)
  - [Caching](#caching)
  - [Optimize Assets](#optimize-assets)
  - [Debouncing and Throttling](#debouncing-and-throttling)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Resources](#resources)
- [4. Maintainability](#4-maintainability)
  - [Implementation Checklist](#implementation-checklist)
  - [Testing](#testing)
  - [Error Handling](#error-handling)
  - [Documentation](#documentation)
  - [Code Reviews](#code-reviews)
  - [Version Control](#version-control)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Resources](#resources)
- [5. Styling](#5-styling)
  - [Implementation Checklist](#implementation-checklist)
  - [Tailwind CSS](#tailwind-css)
  - [CSS Modules](#css-modules)
  - [Prettier Configuration](#prettier-configuration)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Automation](#automation)
  - [Resources](#resources)
- [6. Git Workflow](#6-git-workflow)
  - [Implementation Checklist](#implementation-checklist)
  - [Branching Strategy](#branching-strategy)
  - [Example Workflow](#example-workflow)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Automation](#automation)
  - [Resources](#resources)
- [7. Tooling](#7-tooling)
  - [Implementation Checklist](#implementation-checklist)
  - [ESLint Configuration](#eslint-configuration)
  - [Prettier Configuration](#prettier-configuration)
  - [Husky Configuration](#husky-configuration)
  - [lint-staged Configuration](#lint-staged-configuration)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Automation](#automation)
  - [Resources](#resources)
- [8. Deployment](#8-deployment)
  - [Implementation Checklist](#implementation-checklist)
  - [CI/CD Pipeline](#ci-cd-pipeline)
  - [Example GitHub Actions Workflow](#example-github-actions-workflow)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Automation](#automation)
  - [Resources](#resources)
- [9. Team Collaboration](#9-team-collaboration)
  - [Implementation Checklist](#implementation-checklist)
  - [Code Ownership](#code-ownership)
  - [Knowledge Sharing](#knowledge-sharing)
  - [Project Management](#project-management)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Automation](#automation)
  - [Resources](#resources)
- [10. Example Configuration Files](#10-example-configuration-files)
  - [ESLint Configuration](#eslint-configuration)
  - [Prettier Configuration](#prettier-configuration)
  - [package.json Scripts](#packagejson-scripts)
- [11. Code Reviews](#11-code-reviews)
  - [Implementation Checklist](#implementation-checklist)
  - [Code Review Guidelines](#code-review-guidelines)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Automation](#automation)
  - [Resources](#resources)
- [12. Error Handling](#12-error-handling)
  - [Implementation Checklist](#implementation-checklist)
  - [Error Handling Guidelines](#error-handling-guidelines)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Automation](#automation)
  - [Resources](#resources)
- [13. Accessibility](#13-accessibility)
  - [Implementation Checklist](#implementation-checklist)
  - [Accessibility Guidelines](#accessibility-guidelines)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Automation](#automation)
  - [Resources](#resources)
- [14. Deployment Best Practices](#14-deployment-best-practices)
  - [Implementation Checklist](#implementation-checklist)
  - [Deployment Guidelines](#deployment-guidelines)
  - [Metrics & Success Criteria](#metrics--success-criteria)
  - [Automation](#automation)
  - [Resources](#resources)

## Version History
- v1.0.0 (2025-03-06): Initial release

## Search Tags
#code-quality #security #performance #maintainability #styling #git #tooling #deployment #collaboration

## 1. Code Quality

### Implementation Checklist

- [ ] Use consistent naming conventions
- [ ] Follow feature-based folder structure
- [ ] Use absolute imports
- [ ] Write comprehensive JSDoc comments

### Naming Conventions [Priority: High]
- Use `camelCase` for variables and functions
  - **Good**: `const userName = 'John'`
  - **Bad**: `const User_name = 'John'`
  - **Good**: `function calculateTotal(items: number[]): number { ... }`
  - **Bad**: `function CalculateTotal(items: number[]): number { ... }`

**Implementation Example**:
```typescript
// Correct
const userProfile = { name: 'John' };

// Incorrect (non-compliance example)
const User_profile = { Name: 'John' }; // Violates camelCase and naming conventions
```

**Metrics**:
- 100% compliance with naming conventions
- 0 linting errors for naming

**Automation**:
- Configure ESLint with `camelcase` rule
- Use Prettier for consistent formatting

**Resources**:
- [Airbnb Naming Conventions](https://airbnb.io/javascript/#naming-conventions)
- [TypeScript Naming Guidelines](https://google.github.io/styleguide/tsguide.html#naming)

### File Structure

- Follow a feature-based folder structure:

```typescript
src/
├── features/
│   ├── auth/          // Authentication feature
│   ├── dashboard/     // Dashboard feature
│   └── products/      // Products feature
├── components/      // Reusable components
├── hooks/           // Custom React hooks
├── utils/           // Utility functions
└── services/        // API services
```

- Use `index.ts` files for cleaner imports within feature folders. This allows you to import directly from the feature folder, rather than specifying the file path.

**Example**:

```typescript
// Instead of:
import { MyComponent } from "@/features/auth/components/MyComponent";

// Use: (if MyComponent is exported in "@/features/auth/components/index.ts")
import { MyComponent } from "@/features/auth/components";
```

### Imports

- Use absolute imports (e.g., `@/components/Button`). This assumes a configured `@` alias for the `src` directory in your `tsconfig.json` or `jsconfig.json`.  This improves readability and prevents broken imports when moving files.
- Group imports by type:

```typescript
// External
import React from "react";
import axios from "axios";

// Internal
import { Button } from "@/components";
import { useAuth } from "@/hooks";
```

### Comments

- Use JSDoc for functions and components, especially for complex logic or public APIs:

```typescript
/**
 * Fetches user data from the API.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<User>} - The user data. Rejects if the user is not found.
 * @throws {Error} If the API request fails.
 */
async function fetchUser(userId: string): Promise<User> {
  // ...
}
```

- Avoid unnecessary comments; let the code speak for itself. Focus on _why_ something is done, not _what_ is being done (unless the _what_ is not immediately obvious).

### Resources

- [Airbnb JavaScript Style Guide](https://airbnb.io/javascript/)
- [TypeScript Coding Guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)
-  [JSDoc Guide](https://jsdoc.app/)

## 2. Security [Priority: Critical]

### Implementation Checklist

- [ ] Validate all user inputs
- [ ] Implement secure authentication
- [ ] Configure environment variables securely
- [ ] Set up proper CORS configuration
- [ ] Enable security headers
- [ ] Implement rate limiting

### Input Validation
- Validate all user inputs using a schema validation library like Zod, Yup, or Joi
- Sanitize inputs to prevent XSS (Cross-Site Scripting) and SQL injection
- Always validate data on the server-side, even if validated client-side

**Implementation Example**:

```typescript
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const validateUser = (input: unknown) => {
  return userSchema.parse(input);
};
```

**Metrics & Success Criteria**:
- 100% input validation coverage
- 0 security vulnerabilities in code scans
- Regular penetration testing

**Automation**:
- Add security scanning to CI/CD pipeline
- Use automated dependency vulnerability checks

**Resources**:
- [Zod Documentation](https://zod.dev/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

### Authentication

- Use OAuth 2.0 or JWT (JSON Web Tokens) for authentication.
- Store tokens securely:
  - For JWTs, use HTTP-only cookies to prevent client-side JavaScript access.
  - Consider using a refresh token mechanism to obtain new access tokens without requiring the user to re-authenticate.
- Implement proper session management and expiration.

### Environment Variables

- Use `.env` files for environment-specific configurations.
- Never hardcode sensitive information (e.g., API keys, database credentials) directly in the code.
- Use a library like `dotenv` to load environment variables.

### CORS (Cross-Origin Resource Sharing)

- Configure CORS to allow only trusted origins. Be _very_ specific about which origins are allowed.
- Use middleware to validate origin headers on the server-side. This is a crucial security measure.
- Consider using a whitelist approach for allowed origins.

## 3. Performance [Priority: High]

### Implementation Checklist

- [ ] Implement lazy loading for components
- [ ] Set up caching strategies
- [ ] Optimize assets and images
- [ ] Use debouncing/throttling where appropriate

### Lazy Loading
- Use `React.lazy` and `<Suspense>` for code splitting
- Dynamically import heavy components:

```typescript
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));
```

**Metrics**:
- 30% reduction in initial bundle size
- 50% faster component load times

**Automation**:
- Configure Webpack/Babel for automatic code splitting
- Use bundle analyzer to identify optimization opportunities

**Resources**:
- [React.lazy Documentation](https://reactjs.org/docs/code-splitting.html#reactlazy)
- [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/)

### Caching

- Use a data fetching library like React Query, SWR, or Apollo Client with caching enabled.
- Implement server-side caching (e.g., Redis, Memcached) for frequently accessed data. Consider using a caching strategy like stale-while-revalidate.
- Use browser caching with appropriate cache headers (e.g., `Cache-Control`, `ETag`).

### Optimize Assets

- Compress images using `next/image` (if using Next.js) or a similar image optimization library (e.g., `sharp`).
- Minify CSS and JavaScript files during the build process.
- Use a CDN (Content Delivery Network) to serve static assets.
- Optimize fonts (e.g., preloading, subsetting).

### Debouncing and Throttling

- Use debouncing for search inputs, auto-complete, and other events that trigger frequent API calls:

```typescript
import { debounce } from "lodash";

const handleSearch = debounce((query) => {
  fetchResults(query);
}, 300); // Adjust the delay as needed
```

- Use throttling for events that should be rate-limited (e.g., scroll events).

### Metrics & Success Criteria

- Lighthouse performance score > 90
- First Contentful Paint < 2s
- Time to Interactive < 3.5s

### Resources

- [React.lazy Documentation](https://reactjs.org/docs/code-splitting.html#reactlazy)
- [Lighthouse Auditing](https://developers.google.com/web/tools/lighthouse/)

## 4. Maintainability [Priority: High]

### Implementation Checklist

- [ ] Write comprehensive tests
- [ ] Implement error boundaries
- [ ] Document code and architecture
- [ ] Establish code review process

### Testing

- Write unit tests for all utility functions, hooks, and components
- Use Jest and React Testing Library for testing React components
- Aim for high test coverage (80% or higher)

**Example Test**:
```typescript
test("renders login form", () => {
  render(<LoginForm />);
  expect(screen.getByLabelText("Username")).toBeInTheDocument();
});
```

**Metrics & Success Criteria**:
- 80%+ test coverage
- 0 critical bugs in production
- Weekly code review completion

**Automation**:
- Set up automated test coverage reporting
- Configure CI/CD pipeline to enforce test coverage thresholds

**Resources**:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### Error Handling

- Use error boundaries for React components to gracefully handle errors and prevent the entire application from crashing
- Log errors to a centralized service (e.g., Sentry, Rollbar) for monitoring and debugging. Include context information (user ID, request details, etc.) in your logs
- Implement proper try-catch blocks and handle exceptions appropriately
- Provide informative error messages to the user

### Documentation

- Use Markdown for documentation
- Include code examples and API references
- Keep documentation up-to-date
- Use a tool like Storybook to document and showcase UI components

### Code Reviews

- Establish code review process
- Create pull request templates
- Set up review guidelines

### Code Review Guidelines
- Review for code quality, security, and performance
- Provide constructive feedback
- Aim for timely reviews (within 24 hours)

**Example Pull Request Template**:
```markdown
## Description

### What does this PR do?

### Related Issues

### Screenshots (if applicable)

### Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guidelines
```

**Metrics & Success Criteria**:
- 100% of PRs reviewed within 24 hours
- 0 critical issues in production
- 90%+ positive feedback on reviews

**Automation**:
- Set up required reviews in GitHub
- Configure CI/CD pipeline to enforce review requirements

**Resources**:
- [GitHub Code Review Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)
- [Google Code Review Guidelines](https://google.github.io/eng-practices/review/)

### Version Control

- Use Git for version control
- Follow a branching strategy (e.g., Gitflow) to manage code changes

## 5. Styling [Priority: Medium]

### Implementation Checklist

- [ ] Configure Tailwind CSS
- [ ] Set up CSS Modules
- [ ] Establish Prettier formatting rules

### Tailwind CSS
- Use utility-first classes for styling
- Avoid custom CSS unless absolutely necessary

**Example Configuration**:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Metrics & Success Criteria**:
- 90%+ styling consistency across components
- 0 custom CSS files
- Consistent Prettier formatting

**Automation**:
- Set up Tailwind CSS IntelliSense in IDE
- Configure Prettier to format Tailwind classes

**Resources**:
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)

### CSS Modules

- Use CSS Modules for component-specific styles
- Follow BEM naming convention for class names

### Prettier Configuration

- Configure Prettier to automatically format code on save

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2
}
```

### Metrics & Success Criteria

- 90%+ styling consistency across components
- 0 custom CSS files
- Consistent Prettier formatting

### Automation

- Set up Tailwind CSS IntelliSense in IDE
- Configure Prettier to format Tailwind classes

### Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)

## 6. Git Workflow [Priority: High]

### Implementation Checklist

- [ ] Establish branching strategy
- [ ] Configure commit message conventions
- [ ] Set up pull request templates

### Branching Strategy
- Use `feature/feature-name` for new features
- Use `bugfix/issue-name` for bug fixes
- Use `hotfix/issue-name` for urgent fixes

**Example Workflow**:
```bash
# Create new feature branch
git checkout -b feature/new-authentication

# Commit changes following conventions
git commit -m 'feat(auth): add OAuth2 login support'

# Push to remote
git push origin feature/new-authentication
```

**Metrics & Success Criteria**:
- 100% compliance with branch naming
- 90%+ compliance with commit message conventions
- All PRs use templates

**Automation**:
- Configure Husky for commit message validation
- Set up GitHub Actions for branch protection rules

**Resources**:
- [Git Flow Documentation](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 7. Tooling [Priority: Medium]

### Implementation Checklist

- [ ] Configure ESLint
- [ ] Set up Prettier
- [ ] Add Husky hooks
- [ ] Configure lint-staged

### ESLint Configuration
- Use Airbnb Style Guide as base
- Add custom rules for project-specific conventions

**Example Configuration**:
```json
{
  "extends": ["airbnb", "prettier"],
  "plugins": ["react", "import"],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],
    "import/extensions": ["error", "never"],
    "no-console": "warn"
  }
}
```

**Metrics & Success Criteria**:
- 0 linting errors in CI/CD pipeline
- 100% Prettier formatting consistency
- All commits pass pre-commit hooks

**Automation**:
- Set up pre-commit hooks with Husky
- Configure IDE to auto-fix linting errors on save

**Resources**:
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

### Prettier Configuration

- Configure Prettier to automatically format code on save

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2
}
```

### Husky Configuration

- Add pre-commit hooks using Husky to run linters and formatters before each commit

```json
{
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

### lint-staged Configuration

- Use `lint-staged` to run linters and formatters only on staged files

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

### Metrics & Success Criteria

- 0 linting errors in CI/CD pipeline
- 100% Prettier formatting consistency
- All commits pass pre-commit hooks

### Automation

- Set up pre-commit hooks with Husky
- Configure IDE to auto-fix linting errors on save

### Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

## 8. Deployment [Priority: Critical]

### Implementation Checklist
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables
- [ ] Implement monitoring and alerts

### CI/CD Pipeline
- Use GitHub Actions or CircleCI for automated builds and deployments
- Run tests and linting on every push and pull request

**Example GitHub Actions Workflow**:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run build
```

**Metrics & Success Criteria**:
- 100% automated deployments
- 0 failed deployments in production
- All critical alerts acknowledged within 1 hour

**Automation**:
- Set up automatic rollback on failed deployments
- Configure monitoring dashboards

**Resources**:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CircleCI Documentation](https://circleci.com/docs/)

## 9. Team Collaboration [Priority: Medium]

### Implementation Checklist

- [ ] Define code ownership
- [ ] Establish knowledge sharing practices
- [ ] Set up project management tools

### Code Ownership

- Assign owners for critical modules
- Use GitHub CODEOWNERS file to define ownership

**Example CODEOWNERS**:
```plaintext
src/features/auth/ @team-auth
src/features/dashboard/ @team-dashboard
```

**Metrics & Success Criteria**:
- 100% code ownership coverage
- Weekly knowledge sharing sessions
- 90%+ task completion rate

**Automation**:
- Set up automated code ownership reminders
- Integrate project management tools with version control

**Resources**:
- [GitHub CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Notion Documentation](https://www.notion.so/help)

### Knowledge Sharing

- Establish regular knowledge sharing sessions
- Use a shared knowledge base (e.g., Notion, Confluence) for documentation

**Example Knowledge Sharing Session**:
```markdown
# Knowledge Sharing Session

## Topic: React Hooks

### Presenter: @john-doe

### Notes:

* React Hooks are a way to use state and other React features in functional components.
* The most commonly used hooks are `useState`, `useEffect`, and `useContext`.
* Hooks can be used to simplify code and make it more readable.
```

### Project Management

- Use a project management tool (e.g., Jira, Asana, Trello) to track tasks and progress
- Establish clear project goals and objectives

**Example Project Management Board**:
```markdown
# Project Management Board

## Tasks:

* Implement new feature
* Fix bug
* Review code

## Progress:

* 50% complete
* 25% complete
* 0% complete
```

## 10. Example Configuration Files

### ESLint Configuration
```json
{
  "extends": ["airbnb", "prettier"],
  "plugins": ["react", "import"],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],
    "import/extensions": ["error", "never"],
    "no-console": "warn"
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2
}
```

### package.json Scripts
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,scss,json}",
    "prepare": "husky install"
  }
}
```

## 11. Code Reviews [Priority: High]

### Implementation Checklist

- [ ] Establish code review process
- [ ] Create pull request templates
- [ ] Set up review guidelines

### Code Review Guidelines
- Review for code quality, security, and performance
- Provide constructive feedback
- Aim for timely reviews (within 24 hours)

**Example Pull Request Template**:
```markdown
## Description

### What does this PR do?

### Related Issues

### Screenshots (if applicable)

### Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guidelines
```

**Metrics & Success Criteria**:
- 100% of PRs reviewed within 24 hours
- 0 critical issues in production
- 90%+ positive feedback on reviews

**Automation**:
- Set up required reviews in GitHub
- Configure CI/CD pipeline to enforce review requirements

**Resources**:
- [GitHub Code Review Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)
- [Google Code Review Guidelines](https://google.github.io/eng-practices/review/)

## 12. Error Handling [Priority: High]

### Implementation Checklist

- [ ] Implement error boundaries
- [ ] Set up error logging
- [ ] Create user-friendly error messages

### Error Handling Guidelines
- Use error boundaries for React components
- Log errors to a centralized service (e.g., Sentry)
- Provide clear, actionable error messages

**Example Error Boundary**:
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

**Metrics & Success Criteria**:
- 100% error logging coverage
- 90%+ actionable error messages
- 0 unhandled exceptions in production

**Automation**:
- Set up automated error alerts
- Configure error tracking dashboards

**Resources**:
- [React Error Boundaries Documentation](https://reactjs.org/docs/error-boundaries.html)
- [Sentry Documentation](https://docs.sentry.io/)

## 13. Accessibility [Priority: High]

### Implementation Checklist

- [ ] Implement ARIA attributes
- [ ] Ensure keyboard navigation
- [ ] Test for color contrast

### Accessibility Guidelines
- Use semantic HTML elements
- Provide alt text for images
- Ensure proper color contrast ratios

**Example Accessible Component**:
```typescript
function AccessibleButton({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      aria-label="Submit form"
      tabIndex={0}
    >
      {children}
    </button>
  );
}
```

**Metrics & Success Criteria**:
- 100% compliance with WCAG 2.1 AA standards
- 90%+ accessibility score in automated tests
- 0 critical accessibility issues

**Automation**:
- Set up automated accessibility testing
- Configure CI/CD pipeline to enforce accessibility checks

**Resources**:
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [React Accessibility Documentation](https://reactjs.org/docs/accessibility.html)

## 14. Deployment Best Practices [Priority: Critical]

### Implementation Checklist

- [ ] Set up staging environment
- [ ] Implement blue-green deployment
- [ ] Configure rollback strategy

### Deployment Guidelines

- Use feature flags for gradual rollouts
- Monitor key metrics during deployment
- Automate deployment pipelines

**Example Deployment Pipeline**
```yaml
name: Production Deployment

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run build
      - run: npm run deploy
```

**Metrics & Success Criteria**:
- 99.9% deployment success rate
- <5 minutes rollback time
- 0 downtime during deployments

**Automation**:
- Set up automated health checks
- Configure canary deployments

**Resources**:
- [GitHub Actions Documentation](https://docs.github.com/en/actions/deployment)
- [Blue-Green Deployment Strategy](https://martinfowler.com/bliki/BlueGreenDeployment.html)