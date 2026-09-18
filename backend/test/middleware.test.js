const assert = require('assert');
const { repositoryFactory } = require('../src/repositories');
const { authMiddleware } = require('../src/middleware/auth');
const { validateBody } = require('../src/middleware/validation');
const { rateLimit } = require('../src/middleware/rateLimiter');

async function runTests() {
  process.env.ADMIN_PASSWORD = 'testpassword';
  console.log('Initializing repositories in in-memory mode...\n');
  
  repositoryFactory.reset();
  repositoryFactory.initialize({ useInMemory: true });
  
  const repos = repositoryFactory.getRepositories();
  const coursesRepo = repos.courses;

  // Test auth middleware
  console.log('Testing auth middleware...');
  
  // Test missing auth header
  let req = { headers: {} };
  let res = { status: (code) => ({ json: (body) => ({ statusCode: code, body }) }) };
  let nextCalled = false;
  let capturedStatus = null;
  let capturedError = null;
  
  res = {
    status: (code) => {
      capturedStatus = code;
      return {
        json: (body) => {
          capturedError = body;
          return { statusCode: code, body };
        }
      };
    }
  };
  
  authMiddleware(req, res, () => { nextCalled = true; });
  assert.strictEqual(capturedStatus, 401, 'Should return 401 for missing auth');
  assert.strictEqual(capturedError.error, 'Missing authorization token', 'Should return missing token error');
  assert.strictEqual(nextCalled, false, 'Should not call next()');
  console.log('✓ auth middleware rejects missing token');

  // Test invalid auth token
  req = { headers: { authorization: 'Bearer wrongpassword' } };
  capturedStatus = null;
  capturedError = null;
  nextCalled = false;
  
  authMiddleware(req, res, () => { nextCalled = true; });
  assert.strictEqual(capturedStatus, 403, 'Should return 403 for invalid token');
  assert.strictEqual(capturedError.error, 'Invalid authorization token', 'Should return invalid token error');
  assert.strictEqual(nextCalled, false, 'Should not call next()');
  console.log('✓ auth middleware rejects invalid token');

  // Test valid auth token
  process.env.ADMIN_PASSWORD = 'testpassword';
  req = { headers: { authorization: 'Bearer testpassword' } };
  capturedStatus = null;
  capturedError = null;
  nextCalled = false;
  
  authMiddleware(req, res, () => { nextCalled = true; });
  assert.strictEqual(nextCalled, true, 'Should call next() for valid token');
  console.log('✓ auth middleware accepts valid token');

  // Test validation middleware
  console.log('\nTesting validation middleware...');
  
  const validateTitle = validateBody(['title']);
  
  // Test missing required field
  req = { body: {} };
  capturedStatus = null;
  capturedError = null;
  nextCalled = false;
  
  validateTitle(req, res, () => { nextCalled = true; });
  assert.strictEqual(capturedStatus, 400, 'Should return 400 for missing field');
  assert.ok(capturedError.error.includes('title'), 'Should mention missing field');
  assert.strictEqual(nextCalled, false, 'Should not call next()');
  console.log('✓ validation middleware rejects missing fields');

  // Test valid body
  req = { body: { title: 'Test Title' } };
  capturedStatus = null;
  capturedError = null;
  nextCalled = false;
  
  validateTitle(req, res, () => { nextCalled = true; });
  assert.strictEqual(nextCalled, true, 'Should call next() for valid body');
  console.log('✓ validation middleware accepts valid body');

  // Test rate limiting middleware
  console.log('\nTesting rate limiting middleware...');
  
  const limiter = rateLimit({ windowMs: 1000, max: 2 });
  
  // Test within limit
  req = { 
    headers: { 'x-forwarded-for': '127.0.0.1' },
      connection: { remoteAddress: '127.0.0.1' }
    };
  capturedStatus = null;
  capturedError = null;
  nextCalled = false;
  
  limiter(req, res, () => { nextCalled = true; });
  assert.strictEqual(nextCalled, true, 'Should allow first request');
  console.log('✓ rate limiter allows first request');

  // Test second request (still within limit)
  nextCalled = false;
  limiter(req, res, () => { nextCalled = true; });
  assert.strictEqual(nextCalled, true, 'Should allow second request');
  console.log('✓ rate limiter allows second request');

  // Test third request (exceeds limit)
  nextCalled = false;
  capturedStatus = null;
  capturedError = null;
  
  limiter(req, res, () => { nextCalled = true; });
  assert.strictEqual(capturedStatus, 429, 'Should return 429 for exceeded limit');
  assert.strictEqual(capturedError.error, 'Too many requests, please try again later.', 'Should return rate limit message');
  assert.strictEqual(nextCalled, false, 'Should not call next()');
  console.log('✓ rate limiter blocks exceeded requests');

  console.log('\n✅ All middleware tests passed!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
