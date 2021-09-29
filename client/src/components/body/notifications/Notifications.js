import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import "./Notifications.css"
import { dispatchGetNotifications, fetchAllNotifications } from '../../../redux/actions/notificationsAction'

function Notifications(props) {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const [Notifications, setNotifications] = useState([])
    const [reload, setreload] = useState(false)

    useEffect(() => {
        axios.post('/api/notifications/get', {}, {
            headers: { Authorization: token }
        }).then(data => {
            setNotifications(data.data.notifications)
        })
        const getNotifications = () => {
            return fetchAllNotifications(token).then(res => {
                dispatch(dispatchGetNotifications(res))
            })
        }
        getNotifications()
    }, [token, auth, reload])

    const dropNotification = (id) => {
        axios.delete(`/api/notifications/${id}`, {
            headers: { Authorization: token }
        }).then(data => {
            if (data.data.reload)
                setreload(!reload)
        })
    }
    
    return (
        <div className="notificationsMap">
            {   Notifications.length ?
                Notifications.map((n, i) =>
                    <div key={i} className="notification">
                        <div className="notificationHeader">
                            <div className="notificationHeaderContent">
                                {n.description}
                                <Link to={"/question/" + n.onWhatId}>{n.onWhatId}</Link>
                            </div>
                            <button onClick={() => dropNotification(n._id)}>X</button>
                        </div>
                    </div>
                ) :
                <div>No notifications</div>
            }
        </div>
    )
}
export default Notifications