## Pull Request Review Guide

### Security Checklist
- [ ] No sensitive data exposed (secrets, keys, PII)
- [ ] Environment variables properly configured
- [ ] Security headers implemented (securityHeaders.ts)
- [ ] Authentication/authorization properly enforced
- [ ] Input validation implemented
- [ ] CORS/CSP policies configured
- [ ] SQL injection prevention measures in place
- [ ] XSS protection implemented

### Performance Checklist
- [ ] Code splitting/lazy loading used appropriately
- [ ] Assets optimized (images, fonts, etc.)
- [ ] Bundle size optimized (next.config.mjs)
- [ ] Unnecessary re-renders eliminated
- [ ] Caching implemented where beneficial
- [ ] Performance monitoring configured
- [ ] Database queries optimized
- [ ] API response times acceptable

### Testing Coverage
- [ ] Unit tests added (>70% coverage)
- [ ] Integration tests passing
- [ ] Edge cases covered
- [ ] Error handling tested
- [ ] Performance regression tests included
- [ ] Browser compatibility verified
- [ ] Mobile responsiveness tested
- [ ] Accessibility (a11y) tests passed

### Code Quality
- [ ] Follows project style guidelines
- [ ] Documentation updated
- [ ] No debug code in production
- [ ] Error boundaries implemented
- [ ] Type safety enforced
- [ ] Code duplication minimized
- [ ] Complex logic documented
- [ ] Naming conventions followed

### Description

**What does this PR do?**
[Provide a clear, concise description of the changes]

**Related Issues**
[Link to related issues or tickets]

**Breaking Changes**
[List any breaking changes and migration steps]

**Screenshots/Videos**
[If applicable, add visual references]

### Test Results
```
# Paste test results including coverage metrics
```

### Performance Metrics
```
# Include before/after performance measurements
```

### Reviewer Notes
- Focus on security implications
- Verify error handling
- Check for performance impacts
- Ensure proper documentation

### Post-Deployment Checklist
- [ ] Monitoring alerts configured
- [ ] Backup procedures verified
- [ ] Rollback plan documented
- [ ] User documentation updated