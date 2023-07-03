export const parseUrl = (url: string) => {
  const arrFromURL = url.slice(1).split('/');

  return arrFromURL;
};
