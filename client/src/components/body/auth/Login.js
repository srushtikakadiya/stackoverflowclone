import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { dispatchLogin } from '../../../redux/actions/authAction'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';


const initialState = {
    email: '',
    password: '',
    err: '',
    success: ''
}

function Login() {
    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()

    const { email, password, err, success } = user

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, err: '', success: '' })
    }


    const handleSubmit = async e => {
        e.preventDefault()
            const res = await axios.post('/api/auth/login', { email, password })
            alert(res?.data?.msg)
            if(res?.data?.success) {
                localStorage.setItem('firstLogin', true)
                dispatch(dispatchLogin())
                history.push("/")
            }
        
    }

    const responseGoogle = async (response) => {
            const res = await axios.post('/api/auth/google_login', { tokenId: response.tokenId })
            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push('/')
       
    }

    const responseFacebook = async (response) => {
            const { accessToken, userID } = response
            const res = await axios.post('/api/auth/facebook_login', { accessToken, userID })

            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push('/')
    }

    return (
        <div className="login_page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" placeholder="Enter email address" id="email"
                        value={email} name="email" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Enter password" id="password"
                        value={password} name="password" onChange={handleChangeInput} />
                </div>

                <div className="Login_control">
                    <button className="LoginBtn" type="submit">Login</button>
                    <Link to="/forgot_password">Forgot your password?</Link>
                </div>
            </form>

            <div className="social">
                <GoogleLogin
                    clientId="995235905833-1qbs265qfqs3tmq26r32hbludc1u5vnm.apps.googleusercontent.com"
                    buttonText="Login with google"
                    onSuccess={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />

                <FacebookLogin
                    appId="781160475812473"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                />

            </div>

            <p>New User? <Link to="/register">Register</Link></p>
        </div>
    )
}

export default Login
