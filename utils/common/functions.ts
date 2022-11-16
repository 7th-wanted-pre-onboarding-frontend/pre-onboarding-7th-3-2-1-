export const getParams = (query: { [key: string]: any }) =>
  Object.keys(query).reduce((result: string, key: string) => {
    if (!result) {
      result += `?${key}=${query[key]}`;
    } else {
      result += `&${key}=${query[key]}`;
    }
    return result;
  }, '');
