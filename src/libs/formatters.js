import { translit } from 'gost-transliteration';

function getSlugFromString(string) {
  let url = translit(string, 'ru').toLowerCase();
  url = url.replace(/ /g, '-');
  return url;
}

export default {
  getSlugFromString,
};
