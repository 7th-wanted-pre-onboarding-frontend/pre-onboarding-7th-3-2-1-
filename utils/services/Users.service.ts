import request from '../request';

class UsersService {
  get() {
    return request.get('/api/users');
  }

  convertSecretName(fullName: string) {
    const [firstName, lastName] = fullName.split(/\s/);
    let convertedFirstName = '';

    if (firstName.length > 1) {
      convertedFirstName =
        firstName.slice(0, firstName.length - 1).replace(/./g, '*') +
        firstName.slice(-1);
    } else {
      convertedFirstName = '*';
    }

    return lastName + convertedFirstName;
  }
}

export default new UsersService();
