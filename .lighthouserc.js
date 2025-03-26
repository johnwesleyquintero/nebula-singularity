module.exports = {
  ci: {
    collect: {
      staticDistDir: '.next',
      numberOfRuns: 3,
      url: ['http://localhost:3000/dashboard']
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:accessibility': ['error', {minScore: 0.9}],
        'uses-responsive-images': 'off',
        'csp-xss': 'off'
      }
    }
  }
};