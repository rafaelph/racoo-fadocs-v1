import React from 'react';

import { render } from '../../utils/test-redux-utils';

import Header from './Header';

describe('Header Tests', () => {
  it('should render the component', () => {
    const { container } = render(<Header />);

    expect(container).toBeInTheDocument();
  });
});
