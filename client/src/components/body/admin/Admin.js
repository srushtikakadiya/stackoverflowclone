import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import './Admin.css'

function Admin(props) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const [limit, setlimit] = useState(20)
    const [page, setpage] = useState(0)
    const [SearchType, setSearchType] = useState(false)
    const [AllUsersLength, setAllUsersLength] = useState(0)
    const [users, setusers] = useState([])
    const [searchuser, setsearchuser] = useState("")
    const { user, isAdmin } = auth
    const [loading, setLoading] = useState(false)
    const [callback, setCallback] = useState(false)

    const dispatch = useDispatch()
    const whithout_limit = 100
    useEffect(() => {
        if (isAdmin) {
            axios.post('/api/users/dashboard', { searchuser, page, isAdmin: SearchType, limit: (limit ? limit : whithout_limit) }, {
                headers: { Authorization: token }
            }).then(data => {
                setusers(data.data.users)
                setAllUsersLength(data.data.lengthOfTheUsers)
            })
        } else {
            props.history.push('/')
        }
    }, [token, isAdmin, dispatch, callback, searchuser, limit, page, SearchType])



    const handleDelete = async (id) => {
        if (user._id !== id) {
            if (window.confirm("Are you sure you want to delete this account?")) {
                setLoading(true)
                await axios.delete(`/api/users/delete/${id}`, {
                    headers: { Authorization: token }
                }).then(data => console.log(data))
                setLoading(false)
                setCallback(!callback)
            }
        }
    }

    const setlimf = (e) => {
        if (!isNaN(e.target.value) && e.target.value > 0 && e.target.value != '') {
            setlimit(parseInt(e.target.value))
        } else {
            setlimit('')

        }
    }
    return (
        <div className="admin_page">
            <h2>Users</h2>
            <input value={searchuser} onChange={(e) => { setsearchuser(e.target.value); setpage(0) }}></input>
            <div className="AdminUsersMap">
                {users.map(user => <div className="AdminUsersMapCell" key={user._id}>
                    <img src={user.avatar} />
                    <div className="AdminUsersMapCellId">{user._id}</div>
                    <div className="AdminUsersMapName">{user.name}</div>
                    <div className="AdminUsersMapCellFullName">{user.fullname}</div>
                    <div className="AdminUsersMapCellEmail">{user.email}</div>
                    <div className="AdminUsersMapCellRole">{
                        user.role === 1
                            ? <i className="fas fa-check" title="Admin"></i>
                            : <i className="fas fa-times" title="User"></i>
                    }{user.role ? "Admin" : "User"}</div>
                    <div className="AdminUsersMapCellControl"><button onClick={() => handleDelete(user._id)} className="btn btn-danger">Drop</button><Link to={`/edit_user/${user._id}`} className="btn btn-success">Edit</Link></div>
                </div>)}
            </div>
            <div className="page-controll page-controll-admin">
                <div className="page-controll-btn">
                    <button onClick={() => setSearchType(!SearchType)}>{SearchType ? "Admin" : "All"}</button>
                </div>
                {
                    function () {
                        let btns = []
                        for (let l = 0; l < Math.ceil(AllUsersLength / (limit ? limit : whithout_limit)); l++) {
                            btns.push(<button key={l} onClick={() => setpage(l)}>{l}</button>)
                        }
                        return <div className="page-conroll-pages-list">{btns}</div>
                    }()
                }
                <div className="page-conroll-input">
                    <div className="page-conroll-input-label">Users limit</div>
                    <input className="page-conroll-input"
                        value={limit}
                        type="number"
                        placeholder={whithout_limit}
                        min="1" max="100"
                        onChange={e => setlimf(e)}></input>
                </div>
            </div>
        </div>
    )
}

export default Admin
