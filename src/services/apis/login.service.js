import axios from 'axios';
import GLOBAL from '../../global';

class LoginService {
  postLogin = (nickname, password) => (
    axios.post(`${GLOBAL.url}/login/`,
      {
        nickname,
        password
      }
    )
  )
}

export default new LoginService();