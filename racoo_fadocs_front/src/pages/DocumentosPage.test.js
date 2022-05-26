import React from 'react';
import { render } from '../utils/test-redux-utils';

import DocumentosPage, { orderFiles } from './DocumentosPage';

describe('Utils functions', () => {
  it('should return an ordered by name (folders and files)', () => {
    const unorderedFiles = [
      { mimeType: 'file', name: 'Last' },
      { mimeType: 'folder', name: 'Folder' },
      { mimeType: 'file', name: 'Aouth' },
      { mimeType: 'folder', name: 'Fadocs' },
      { mimeType: 'file', name: 'Efos' },
    ];

    expect(
      orderFiles(unorderedFiles).map((file) => file.name),
    ).toEqual(['Fadocs', 'Folder', 'Aouth', 'Efos', 'Last']);
  });
});

describe('DocumentosPage Test', () => {
  // Suppressing unnecessary warnings on React DOM 16.8
  // See https://github.com/testing-library/react-testing-library
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
      }
      originalError.call(console, ...args);
    };
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should render the page', async () => {
    const { container } = render(<DocumentosPage match={{ params: { isFadocs: 'fadocs' } }} />);

    expect(container).toBeInTheDocument();
  });
});
