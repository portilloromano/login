import axios from 'axios';
import GLOBAL from '../../global';

class LoginService {
  postLogin = (nickname, password) => (
    axios.post(`${GLOBAL.url}/api/ams/v1_5/public/login/`,
      {
        nickname,
        password
      }
    )
  )
}

export default new LoginService();