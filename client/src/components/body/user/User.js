import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import "./User.css"
function User(props) {
    const [User,setUser] = useState({})
    const userId = props.match.params.userId;
  useEffect(() => {
      console.log(userId)
      axios.get(`/api/users/${userId}`).then(
          d => {
              setUser(d.data.user)
          }
      )
  }, [userId])

    return(<div className="userProfileFather">
            <div className="userProfile">
                <img src={User.avatar}></img>
                <div className="userProfileContent">
                    <div className="profileName">{User?.name}</div>
                    <div className="profileFull">{User?.fullname}</div>
                    <div className="profileFull">{User?.email}</div>
                    <div className="profileRole" >{User?.role ? "Admin" : "Not admin"}</div>
                    <div className="tagsMapFromProfile">
                        {User?.tags?.map((t,i) => <div className="tagFromProfile" key={i}>{t}</div>)}
                    </div>
                    <div>
                        On site from: {User?.createdAt?.split('T')[0]}
                    </div>
                </div>
            </div>
            <div className="userRatings">
                Ratings
            </div>
        </div>
    )
}


export default User