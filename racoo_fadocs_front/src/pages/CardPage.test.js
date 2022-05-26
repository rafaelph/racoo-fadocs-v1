import React from 'react';
import { render } from '../utils/test-redux-utils';

import CardPage from './CardPage';

describe('CardPage Test', () => {
  it('should render the page', () => {
    const { container } = render(<CardPage />);

    expect(container).toBeInTheDocument();
  });
});
