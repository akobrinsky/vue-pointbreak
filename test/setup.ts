import mediaQuery from 'css-mediaquery';
import { vi } from 'vitest';

/* https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
  * This is used by the breakpoint plugin */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => {
    const instance = {
      matches: mediaQuery.match(query, {
        width: window.innerWidth,
        height: window.innerHeight,
      }),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    window.addEventListener('resize', () => {
      const change = mediaQuery.match(query, {
        width: window.innerWidth,
        height: window.innerHeight,
      });

      if (change !== instance.matches) {
        instance.matches = change;
        instance.dispatchEvent('change');
      }
    });

    return instance;
  }),
});

// https://developer.mozilla.org/en-US/docs/Web/API/Window/resizeTo
Object.defineProperty(window, 'resizeTo', {
  value: (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    });
    Object.defineProperty(window, 'outerWidth', {
      configurable: true,
      writable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  },
});
