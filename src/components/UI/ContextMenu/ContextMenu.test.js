import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ContextMenu from './ContextMenu';

const contextMenu = {
  open: {
    text: 'Открыть',
    clicked: null,
    disabled: false,
  },
  copy: {
    text: 'Копировать',
    clicked: null,
    disabled: true,
  },
  paste: {
    text: 'Вставить',
    clicked: null,
    disabled: true,
  },
  archive: {
    text: 'Архив',
    clicked: null,
    disabled: true,
  },
  save: {
    text: 'Скачать файл',
    clicked: null,
    disabled: true,
  },
  copyUrl: {
    text: 'Скопировать ссылку',
    clicked: null,
    disabled: true,
  },
  delete: {
    text: 'Удалить',
    clicked: null,
    disabled: true,
  },
};

configure({ adapter: new Adapter() });

describe('<ContextMenu />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ContextMenu />);
  });

  it('should render correctly with no props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no props', () => {
    wrapper.setProps({ menuList: contextMenu });
    expect(wrapper).toMatchSnapshot();
  });

  it('<ContextMenu /> rendered and contain tag <ul>', () => {
    expect(wrapper.find('ul')).toHaveLength(1);
  });

  it('<ContextMenu /> with menu list contain 7 elements', () => {
    wrapper.setProps({ menuList: contextMenu });
    expect(wrapper.find('ContextMenuItem')).toHaveLength(7);
  });

  it('<ContextMenu /> with menu list contain 6 disabled elements', () => {
    wrapper.setProps({ menuList: contextMenu });
    expect(wrapper.find('ContextMenuItem[disabled=true]')).toHaveLength(6);
  });

  it('<ContextMenu /> with menu list contain element with text "Скачать файл"', () => {
    wrapper.setProps({ menuList: contextMenu });
    expect(wrapper.find('ContextMenuItem[text="Скачать файл"]')).toHaveLength(1);
  });
});
