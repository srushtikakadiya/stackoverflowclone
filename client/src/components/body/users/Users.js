import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import './Users.css'


function Users(props) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const [limit, setlimit] = useState(20)
    const [page, setpage] = useState(0)
    const [SearchType, setSearchType] = useState(false)
    const [AllUsersLength, setAllUsersLength] = useState(0)
    const [users, setusers] = useState([])
    const [searchuser, setsearchuser] = useState("")
    const { user, isAdmin } = auth


    const dispatch = useDispatch()
    const whithout_limit = 100
    useEffect(() => {
        axios.post('/api/users', { searchuser, page, isAdmin: SearchType, limit: (limit ? limit : whithout_limit) }
        ).then(data => {
            setusers(data.data.users)
            setAllUsersLength(data.data.lengthOfTheUsers)
        })
    }, [token, isAdmin, dispatch, searchuser, limit, page, SearchType])

    const setlimf = (e) => {
        if (!isNaN(e.target.value) && e.target.value > 0 && e.target.value != '') {
            setlimit(parseInt(e.target.value))
        } else {
            setlimit('')
        }
    }

    return (
        <div className="profile_page">
            <div className="profile_page_users">
                <h2>Users</h2>
                <input value={searchuser} onChange={(e) => { setsearchuser(e.target.value); setpage(0) }}></input>
                <div className="UsersMap">
                    {users.map(user => <div className="UsersMapCell" key={user._id}>
                        <img src={user.avatar} />
                        <Link to={"user/" + user._id} className="AdminUsersMapName">{user.name}</Link>
                        <div className="UsersMapCellFullName">{user.fullname}</div>
                        <div className="UsersMapCellEmail">{user.email}</div>
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
        </div>
    )
}

export default Users
