import React, { useState } from 'react'
import axios from 'axios'
import { isEmail } from '../../utils/validation/Validation'

const initialState = {
    email: '',
    err: '',
    success: ''
}

function ForgotPassword() {
    const [data, setData] = useState(initialState)

    const { email, err, success } = data

    const handleChangeInput = e => {
        const { name, value } = e.target
        setData({ ...data, [name]: value, err: '', success: '' })
    }

    const forgotPassword = async () => {
        if (!isEmail(email))
            alert("Email")
            const res = await axios.post('/api/auth/forgot', { email })
            alert(res.data.msg)
        
    }

    return (
        <div className="fg_pass">
            <h2>Forgot Your Password?</h2>

            <div className="row">
                <label htmlFor="email">Enter your email address</label>
                <input type="email" name="email" id="email" value={email}
                    onChange={handleChangeInput} />
                <button onClick={forgotPassword}>Verify your email</button>
            </div>
        </div>
    )
}

export default ForgotPassword
