import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Button from './Button';

configure({ adapter: new Adapter() });

describe('<Button />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Button />);
  });

  it('should render correctly with no props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with props', () => {
    wrapper.setProps({ disable: true, children: 'test' });
    expect(wrapper).toMatchSnapshot();
  });

  it('contains tag button', () => {
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('with props.disabled = true <button> has attribute disable ', () => {
    wrapper.setProps({ disable: true });
    expect(wrapper.find('button[disabled]')).toHaveLength(1);
  });

  it('with props.children <button> has text = props.children', () => {
    wrapper.setProps({ children: 'test' });
    expect(wrapper.find('button').text()).toEqual('test');
  });
});
