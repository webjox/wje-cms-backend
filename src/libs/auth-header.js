import jwt from 'jsonwebtoken';
import config from '../../config';

const cert = config.jwtSecretKey;

class AuthHeader {
  constructor() {}

  encodeUserLoginAuth(userId) {
    return jwt.sign({ userId }, cert);
  }

  decodeUserLoginAuth(token) {
    try {
      return jwt.verify(token, cert);
    } catch (error) {
      return error;
    }
  }

  encodeUserPassword(token) {
    return jwt.sign({ password: token }, cert);
  }

  decodeUserPassword(token) {
    try {
      return jwt.verify(token, cert);
    } catch (error) {
      console.log(`${error}`.red);
    }
  }
}

export default new AuthHeader();
