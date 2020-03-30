import axios from 'axios';
import GLOBAL from '../../global';

class UserService {
    getUsers = (token) => (
        axios.get(`${GLOBAL.url}/api/ams/v1_0/private/users`, {
            headers: { Authorization: "Bearer " + token }
        })
    )

    activateUser = (id, token) => (
        axios.put(`${GLOBAL.url}/api/ams/v1_0/private/users/active/${id}`, null, {
            headers: { Authorization: "Bearer " + token }
        })
    )
}

export default new UserService();