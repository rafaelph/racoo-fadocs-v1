import React from 'react';

import { render } from '../utils/test-redux-utils';

import UserImage from './UserImage';


describe('UserImage tests', () => {
  it('should render the component', () => {
    const { container } = render(<UserImage  />);

    expect(container).toBeInTheDocument();
   });
});
