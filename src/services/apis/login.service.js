import axios from 'axios';
import GLOBAL from '../../global';

class LoginService {
  postLogin = ({ data }) => (
    axios.post(`${GLOBAL.url}/api/ams/v1_5/public/login/`, data)
  );
}

export default new LoginService();