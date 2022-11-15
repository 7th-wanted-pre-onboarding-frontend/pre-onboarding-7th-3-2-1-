class CookieService {
  get(key: string) {
    const regex = new RegExp(`${key}=(.[^;]*)`, 'ig');
    const found = regex.exec(document.cookie);
    let result = null;
    if (found && found.length) {
      result = found[1];
    }
    return result;
  }

  remove(key: string) {
    document.cookie = `${key}= ; max-Age=-1`;
  }
}

export default new CookieService();
