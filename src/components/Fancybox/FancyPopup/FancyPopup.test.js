import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FancyPopup from './FancyPopup';

configure({ adapter: new Adapter() });

describe('<FancyPopup />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<FancyPopup />);
  });

  it('render paragraph with Error message', () => {
    expect(wrapper.contains(<p>Error url to file</p>)).toBeTruthy();
  });

  it('render img, if path with png extentions', () => {
    wrapper.setProps({ path: './images/image1.png' });
    expect(wrapper.find('img')).toHaveLength(1);
  });

  it('render pdf, if path with png extentions', () => {
    wrapper.setProps({ path: './assets/test.pdf' });
    expect(wrapper.find('embed')).toHaveLength(1);
  });
});
