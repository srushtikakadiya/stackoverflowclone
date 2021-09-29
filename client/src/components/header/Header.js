import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'


function Header() {
    const auth = useSelector(state => state.auth)
    const notifications = useSelector(state => state?.notifications?.notifications)
    const { user, isLogged } = auth
    const handleLogout = async () => {
        try {
            await axios.get('/api/auth/logout')
            localStorage.removeItem('firstLogin')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }

    const userLink = () => {
        return <li className="header-acc-control">
            <Link to={"/user/" + user._id} className="avatar">
                <img src={user.avatar} alt="" />
            </Link>
            <div className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-expanded="false">{user.name}</a>
                <ul className="dropdown-menu" aria-labelledby="dropdown01">
                    <li><Link className="dropdown-item" to={"/user/" + user._id}>Profile</Link></li>
                    <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                    <li>{user.role ?
                        <div><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></div>
                        : null}</li>
                    <li><Link className="dropdown-item" to="/" onClick={handleLogout}>Logout</Link></li>
                </ul>
            </div>
        </li>
    }


    return (
        <div className="nav-shell fixed-top navbar-dark bg-dark">
            <nav className="navbar-expand-lg navbar" aria-label="Main navigation">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">StackOverflow</a>
                    <button className="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
                        <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
                            <li className="nav-item active">
                                <Link className="nav-link" aria-current="page" to="/questions">Questions</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/users">Users</Link >
                            </li>
                            {
                                isLogged
                                    ? <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/create">Create</Link >
                                        </li>
                                        {auth.isAdmin &&
                                            <li className={"nav-item " + (notifications?.length ? "red" : "")}>
                                                <Link className="nav-link" to="/notifications">Notifications</Link >
                                            </li>
                                        }
                                    </>
                                    : null}

                        </ul>
                        <div className="d-flex">
                            {
                                isLogged
                                    ? userLink()
                                    : <li><Link to="/login" className="btn btn-outline-success"><i className="fas fa-user"></i> Sign in</Link></li>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </div>


    )
}

export default Header
