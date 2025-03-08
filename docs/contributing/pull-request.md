# Pull Request Guidelines

## Before Creating a Pull Request

1. **Update Your Fork**
   - Ensure your fork is up to date with the main repository
   - Resolve any merge conflicts

2. **Code Quality**
   - Follow our [coding standards](../development/coding-standards.md)
   - Run linting: `npm run lint`
   - Run tests: `npm test`
   - Add/update tests for new features

3. **Documentation**
   - Update relevant documentation
   - Add inline comments for complex logic
   - Update API documentation if needed

## Creating Your Pull Request

1. **Branch Naming**
   - Use descriptive branch names
   - Follow the format: `type/description`
   - Examples:
     - `feature/add-oauth-support`
     - `fix/resolve-login-issue`
     - `docs/update-api-docs`

2. **Pull Request Title**
   - Use conventional commit format
   - Format: `type(scope): description`
   - Example: `feat(auth): add Google OAuth support`

3. **Pull Request Description**
   ```markdown
   ## Description
   [Describe the changes and their purpose]

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] E2E tests added/updated
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] All tests passing
   ```

## Review Process

1. **Code Review**
   - Address reviewer comments promptly
   - Explain complex changes
   - Be open to suggestions

2. **CI/CD Checks**
   - Ensure all automated checks pass
   - Fix any failing tests or linting issues

3. **Updates and Changes**
   - Make requested changes in new commits
   - Squash commits before merging
   - Keep the PR focused on a single change

## After Merge

1. **Clean Up**
   - Delete your feature branch
   - Update your local repository

2. **Follow Up**
   - Monitor the changes in production
   - Address any issues that arise

## Tips for Success

- Keep PRs small and focused
- Write clear commit messages
- Respond to feedback promptly
- Update PR description as needed
- Link related issues and PRs

## Common Issues

1. **Large PRs**
   - Break into smaller, focused PRs
   - Create a tracking issue for related PRs

2. **Merge Conflicts**
   - Regularly rebase with main
   - Resolve conflicts locally

3. **Failed Checks**
   - Review CI/CD logs
   - Test changes locally
   - Update dependencies if needed

## Questions?

If you have questions about the PR process:
- Check our [contributing guide](./README.md)
- Ask in the PR comments
- Join our community discussions