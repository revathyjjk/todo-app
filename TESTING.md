# Unit Testing Guide for Todo App Frontend

## Overview
This guide explains how to set up unit testing for the Next.js frontend using Jest and React Testing Library.

## Recommended Setup

### Step 1: Install Testing Dependencies
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest jest-environment-jsdom
```

### Step 2: Create Jest Configuration
Create a `jest.config.js` file in the root of the `todo-app` directory:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### Step 3: Create Jest Setup File
Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'
```

### Step 4: Update package.json
Add test scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Example Tests

### Component Test - Header Component
File: `components/header/__tests__/header.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../header';

describe('Header Component', () => {
  it('should render the header title', () => {
    const mockLogout = jest.fn();
    render(<Header onLogout={mockLogout} />);
    
    expect(screen.getByText('Welcome to Notepad!')).toBeInTheDocument();
  });

  it('should display user email when provided', () => {
    const mockLogout = jest.fn();
    const testEmail = 'user@example.com';
    
    render(<Header onLogout={mockLogout} email={testEmail} />);
    
    expect(screen.getByText(testEmail)).toBeInTheDocument();
  });

  it('should not display email when not provided', () => {
    const mockLogout = jest.fn();
    
    render(<Header onLogout={mockLogout} />);
    
    // If no email prop, span with email should not exist
    const emailSpans = screen.queryAllByText(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(emailSpans.length).toBe(0);
  });

  it('should call onLogout when logout button is clicked', async () => {
    const mockLogout = jest.fn();
    const user = userEvent.setup();
    
    const { container } = render(<Header onLogout={mockLogout} />);
    
    // Find logout button (IoMdLogOut icon button)
    const logoutButton = container.querySelector('button');
    
    if (logoutButton) {
      await user.click(logoutButton);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    }
  });
});
```

### API Test Example
File: `lib/__tests__/api.test.ts`

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// If you have an API client in lib/api.ts, test it like this:

describe('API Client', () => {
  it('should handle authentication requests', async () => {
    // Mock API calls using Mock Service Worker
    const mockServer = setupServer(
      rest.post('/api/login', (req, res, ctx) => {
        return res(ctx.json({ token: 'mock-token' }));
      })
    );

    mockServer.listen();

    // Test your API call
    // const response = await loginUser({ email: 'test@example.com', password: 'password' });
    // expect(response.token).toBe('mock-token');

    mockServer.close();
  });
});
```

## Testing Best Practices

### 1. Test User Behavior, Not Implementation
```typescript
// ✅ GOOD - Tests what user sees
expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

// ❌ BAD - Tests internal implementation
expect(component.state.isLoggedIn).toBe(false);
```

### 2. Use Semantic Queries
```typescript
// ✅ BEST
screen.getByRole('button', { name: /logout/i })

// ✅ GOOD
screen.getByLabelText('Username')

// ⚠️ OK
screen.getByPlaceholderText('Enter email')

// ❌ AVOID
screen.getByTestId('logout-button')
```

### 3. Async Operations
```typescript
// ✅ GOOD
const element = await screen.findByText('Success!');
expect(element).toBeInTheDocument();

// ❌ BAD - Missing await
const element = screen.getByText('Success!');
```

### 4. Mocking Props
```typescript
// ✅ GOOD - Clear mocks
const mockOnLogout = jest.fn();
render(<Header onLogout={mockOnLogout} />);

// Then verify
expect(mockOnLogout).toHaveBeenCalled();
```

## File Structure
```
todo-app/
├── components/
│   ├── header/
│   │   ├── header.tsx
│   │   ├── header.module.css
│   │   └── __tests__/
│   │       └── header.test.tsx
│   ├── footer/
│   │   └── __tests__/
│   │       └── AddNoteDialog.test.tsx
│   └── ...
├── lib/
│   ├── api.ts
│   └── __tests__/
│       └── api.test.ts
├── jest.config.js
├── jest.setup.js
└── package.json
```

## Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Get coverage report
npm run test:coverage

# Run specific test file
npm test header.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="logout"
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Module not found | Check moduleNameMapper in jest.config.js |
| next/image error | Mock next/image in tests |
| CSS module errors | Add moduleNameMapper for CSS |
| setTimeout in tests | Use jest.useFakeTimers() |

## Next Steps

1. ✅ Install testing dependencies
2. ✅ Create jest.config.js
3. ✅ Create jest.setup.js
4. ✅ Add test scripts to package.json
5. ✅ Create `__tests__` folders in components
6. ✅ Write tests for your components
7. ✅ Run `npm test` to verify

## Useful Resources

- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
