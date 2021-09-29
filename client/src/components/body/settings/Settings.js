import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser, dispatchGetUser } from '../../../redux/actions/authAction'
import "./Settings.css"


function Settings(props) {
  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)
  const { user, isAdmin } = auth
  const dispatch = useDispatch()
  const [nickname, setnickname] = useState(user.name ? user.name : "");
  const [fullname, setfullname] = useState(user.fullname ? user.fullname : "");
  const [avatar, setavatar] = useState(user.avatar ? user.avatar : "");
  const [email, setemail] = useState(user.email ? user.email : "");
  const [tags, settags] = useState(user.tags ? user.tags : []);
  const [password, setpassword] = useState("");
  const [submitpassword, setsubmitpassword] = useState("");
  const initialState = {
    err: '',
    success: ''
  }
  const [data, setData] = useState(initialState)


  const changeAvatar = async (e) => {
    e.preventDefault()
    try {
      const file = e.target.files[0]

      if (!file) return setData({ err: "No files were uploaded.", success: '' })

      if (file.size > 1024 * 1024)
        return setData({ err: "Size too large.", success: '' })

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return setData({ err: "File format is incorrect.", success: '' })

      let formData = new FormData()
      formData.append('file', file)

      const res = await axios.post('/api/users/uploadavatar', formData, {
        headers: { 'content-type': 'multipart/form-data', Authorization: token }
      })
      console.log(res)
      setavatar("/" + res.data.url)

    } catch (err) {
      setData({ err: err.response.data.msg, success: '' })
    }
  }
  const updateMetaInfo = () => {
    axios.post('/api/users/settings/info', { nickname, fullname, avatar, tags }, {
      headers: { Authorization: token }
    }).then(d => {
      alert("Done!")
      fetchUser(token).then(res => {
        dispatch(dispatchGetUser(res))
      })
    })
    console.log()
  }

  useEffect(() => {
    setnickname(user.name)
    setfullname(user.fullname)
    setemail(user.email)
    settags(user.tags)
    setavatar(user.avatar)

  }, [token, isAdmin, user])
  const rmrftag = (i) => {

    let pushArray = []
    for (let y = 0; y < tags.length; y++) {
      if (y != i)
        pushArray.push(tags[y])
    }
    settags(pushArray)
  }
  const addTag = () => {
    settags([...tags, taginput])
    settaginput("")
  }
  const [avatarinput, setavatarinput] = useState("")
  const [taginput, settaginput] = useState("")
  const changePas = () => {
    if (password == submitpassword && password.length > 6) {
      axios.post('/api/users/settings/password', { password: password }, {
        headers: { Authorization: token }
      }).then(d => { alert("Done") })
    }
    else 
    alert("Bad password")
  }
  return (<div className="settings">
    <div className="avatar">
      <img src={avatar ? avatar : user.avatar} alt="" />
      <input type="file" className="file_input" name="file" onChange={changeAvatar} />
      <div className="avatar_input">
        <input value={avatarinput} onChange={e => setavatarinput(e.target.value)} />
        <button onClick={() => setavatar(avatarinput)}>set avatar link</button>
      </div>
    </div>
    <div className="names_control">
      <label>Nick</label>
      <input value={nickname || ""} onChange={e => setnickname(e.target.value)} />
      <label>Full name</label>
      <input value={fullname || ""} onChange={e => setfullname(e.target.value)} />
    </div>
    <div className="settingsTagsMap">
      {tags?.map((tag, i) => <div key={i}>{tag} <button onClick={() => rmrftag(i)}>X</button></div>)}
    </div>
    {tags?.length < 6 ? 
      <div className="settingsTagsInputs">
        <input value={taginput} placeholder="Set tag" onChange={e => { settaginput(e.target.value) }} />
        <button onClick={() => addTag()}>add</button>
      </div> : null
    }
    <button className="submitChanges" onClick={() => updateMetaInfo()}>Submit</button>

    <div className="changePassword">
      <label>Change Password</label>
      <input type="password" value={password} onChange={e => setpassword(e.target.value)} />
      <input type="password" value={submitpassword} onChange={e => setsubmitpassword(e.target.value)} />
      <button className="" onClick={() => changePas()}>Change Password</button>
    </div>


  </div>)
}
export default Settings
