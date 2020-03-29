import axios from 'axios';
import GLOBAL from '../../global';

class InvitationsService {
  postInvitation = (data, token) => (
    axios.post(`${GLOBAL.url}/api/ams/v1_0/private/users/invited`, data, {
      headers: { Authorization: "Bearer " + token }
    })
  )

  deleteInvitation = (id, token) => (
    axios.delete(`${GLOBAL.url}/api/ams/v1_0/private/users/invited/${id}`, {
      headers: { Authorization: "Bearer " + token }
    })
  )

  getBusiness = (token) => (
    axios.get(`${GLOBAL.url}/api/ams/v1_0/private/business`, {
      headers: { Authorization: "Bearer " + token }
    })
  )

  getInvitations = (token) => (
    axios.get(`${GLOBAL.url}/api/ams/v1_0/private/users/invited`, {
      headers: { Authorization: "Bearer " + token }
    })
  )
}

export default new InvitationsService();