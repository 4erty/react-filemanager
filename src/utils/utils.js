export const formatDate = (date) => {
  const formatDate = new Date(date);
  if (!formatDate instanceof Date || isNaN(formatDate.getTime())) return '';

  let year = formatDate.getFullYear();
  year = year < 10 ? '0' + year : year;

  let month = formatDate.getMonth() + 1;
  month = month < 10 ? '0' + month : month;

  let day = formatDate.getDate();
  day = day < 10 ? '0' + day : day;

  let hour = formatDate.getHours();
  hour = hour < 10 ? '0' + hour : hour;

  let minutes = formatDate.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${day}.${month}.${year} ${hour}:${minutes}`;
};

export const formatFilsize = (size) => {
  if (typeof size !== 'number' && typeof size !== 'strin') return 0;

  const bytes = 'bytes_kB_MB_GB_TB'.split('_');
  let res = '';
  let rank = bytes.length - 1;
  while ((size / (1000 ** rank)) <= 1) {
    rank--;
  }
  res = Math.round(size / (1000 ** rank) * 10) / 10 + ' ' + bytes[rank];
  return res;
};

const sort = (a, b) => a.name > b.name ? 1 : -1;

export const sortFiles = (files) => {
  if (!Array.isArray(files)) return [];
  const list = [...files];
  const dirs = list.filter(el=>el.directory === true).sort(sort);
  const filesList = list.filter(el=>el.directory !== true).sort(sort);
  return dirs.concat(filesList);
};

export function clearSelection() {
  if (document.selection && document.selection.empty) {
    document.selection.empty();
  } else if (window.getSelection) {
    let sel = window.getSelection();
    sel.removeAllRanges();
  }
}
