export const dirUrl = '/resources/api/directory/metadata';
export const uploadUrl = '/resources/api/resource/upload';
export const createUrl = '/resources/api/directory/create';
export const copyUrl = '/resources/api/resource/copy';
export const moveUrl = '/resources/api/resource/move';
export const deleteUrl = '/resources/api/resource/delete';
export const zipUrl = '/resources/api/resource/zip';

export const contextMenu = {
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
