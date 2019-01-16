import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Dialog from './Dialog';

configure({ adapter: new Adapter() });

describe('<Dialog />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Dialog />);
  });

  it('should render correctly with no props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
