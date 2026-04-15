import React from 'react';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Expose React globally so JSX elements don't throw ReferenceError when Vitest skips auto-injection
window.React = React;

// Extend Vitest's expect with jest-dom matchers (e.g. toBeInTheDocument)
expect.extend(matchers);

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
