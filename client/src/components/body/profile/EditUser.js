import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import "./EditUser.css"

function EditUser(props) {
    const { id } = useParams()
    const history = useHistory()
    const [editUser, setEditUser] = useState([])
    const auth = useSelector(state => state.auth)
    const { user, isAdmin } = auth

    const token = useSelector(state => state.token)

    const [checkAdmin, setCheckAdmin] = useState(false)
    const [num, setNum] = useState(0)
    useEffect(() => {
        if (isAdmin) {
            axios.post('/api/users/admin/user', { id }, {
                headers: { Authorization: token }
            }).then(data => {
                setEditUser(data.data[0]);
                setCheckAdmin(data.data[0].role === 1 ? true : false)
            })
        }
        else {
            props.history.push('/')
        }
    }, [id, props.history])

    const handleUpdate = async () => {
        try {
            if (num % 2 !== 0 && user._id !== id) {
                const res = await axios.patch(`/api/users/update_role/${editUser._id}`, {
                    role: checkAdmin ? 1 : 0
                }, {
                    headers: { Authorization: token }
                })

                setNum(0)
            }
        } catch (err) {
        }
    }

    const handleCheck = () => {

        setCheckAdmin(!checkAdmin)
        setNum(num + 1)
    }

    return (
        <div className="edit_user">
            <button onClick={() => history.goBack()} className="go_back">
                <i className="fas fa-long-arrow-alt-left"></i> Go Back
                </button>
            <h2>Edit User</h2>

            <label htmlFor="name">Name</label>
            <input type="text" name="name" defaultValue={editUser.name} disabled />

            <label htmlFor="email">Email</label>
            <input type="email" name="email" defaultValue={editUser.email} disabled />
            {editUser._id != auth.user._id &&
                <div className="form-group">
                    <input type="checkbox" id="isAdmin" checked={checkAdmin}
                        onChange={handleCheck} />
                    <label htmlFor="isAdmin">isAdmin</label>
                </div>
            }
            <button onClick={handleUpdate}>Update</button>
        </div>
    )
}

export default EditUser
