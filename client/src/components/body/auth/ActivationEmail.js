import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'

function ActivationEmail(props) {
    const { activation_token } = useParams()
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                
                    const res = await axios.post('/api/auth/activation', { activation_token })
                    if(res?.data?.success){
                        alert("All created")
                        props.history.push("/login")
                        return
                    }
                    alert("Something went wrong");
            }
            activationEmail()
        }
    }, [activation_token])

    return (
        <div className="active_page">
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
        </div>
    )
}

export default ActivationEmail
