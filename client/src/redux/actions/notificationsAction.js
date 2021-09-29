import ACTIONS from './index'
import axios from 'axios'

export const fetchAllNotifications = async (token) => {
    const res = await axios.post('/api/notifications/get',{},{
        headers: {Authorization: token}
    })
    return res
}

export const dispatchGetNotifications = (res) => {
    return {
        type: ACTIONS.NOTIFICATIONS,
        payload: res.data
    }
}