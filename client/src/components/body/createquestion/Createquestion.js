import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { showSuccessMsg, showErrMsg } from '../../utils/notification/Notification'
import { fetchUser, dispatchGetUser } from '../../../redux/actions/authAction'
import "./Createquestion.css"
// import Dropzone from 'react-dropzone';

function Createquestion(props) {
  const [title, settitle] = useState("")
  const [description, setdescription] = useState("")
  const [photos, setphotos] = useState([])
  const [photosinput, setphotosinput] = useState('')

  const [tags, settags] = useState([])
  const [taginput, settaginput] = useState('')
  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)



  const dropTag = i => {
    let pushArray = []
    for (let y = 0; y < tags.length; y++) {
      if (y != i)
        pushArray.push(tags[y])
    }
    settags(pushArray)
  }

  const dropPhoto = i => {
    let pushArray = []
    for (let y = 0; y < photos.length; y++) {
      if (y != i)
        pushArray.push(photos[y])
    }
    setphotos(pushArray)
  }

  const settag = () => {
    if (tags.indexOf(taginput) == -1 && taginput.length) {
      console.log(taginput)
      settags([...tags, taginput])
      settaginput('')
    }
  }


  const setphoto = () => {
    if (photos.indexOf(photosinput) == -1 && photosinput.length) {
      setphotos([...photos, photosinput])
      setphotosinput('')
    }
  }
  const uploadPhoto = async (e) => {
    e.preventDefault()
    try {
      const file = e.target.files[0]

      if (!file) console.log({ err: "No files were uploaded.", success: '' })

      if (file.size > 1024 * 1024)
        alert("Size too large.")

      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.mimetype !== 'image/jpg')
        alert("File format is incorrect.")

      let formData = new FormData()
      formData.append('file', file)

      const res = await axios.post('/api/question/uploadimage', formData, {
        headers: { 'content-type': 'multipart/form-data', Authorization: token }
      })

      setphotos([...photos, "/" + res.data.url])

    } catch (err) {
      console.log({ err: err.response.data.msg, success: '' })
    }
  }
  const createQ = async () => {
    if (title.length > 0 && description.length > 0) {
      const res = await axios.post('/api/question/create', { tags, title, description, photos }, {
        headers: { Authorization: token }
      })
      console.log(res)
      if (res?.data?.reload) {
        props.history.push("/");

      }

    }
  }
  return (
    <div className="inputForm">
      <input className="TitleInput" placeholder="Title" value={title} onChange={e => settitle(e.target.value)}></input>
      <textarea className="DescriptionInput" placeholder="Body" values={description} onChange={e => setdescription(e.target.value)}></textarea>

      <div className="inputFormTagsMap">
        {tags.map((tag, index) => <div className="inputFormTag" key={index}> <span>{tag}</span> <button onClick={() => dropTag(index)}>X</button></div>)}
      </div>
      {tags.length < 6 ? <div className="tagsInputControl">
        <input placeholder="Set tag" onChange={e => settaginput(e.target.value)} value={taginput} />
        <button onClick={() => settag()}>Set tag</button></div> : null}


      <div className="imagesMap">
        {photos.map((src, index) => <img key={index} src={src} onClick={() => dropPhoto(index)} />)}
      </div>
      {photos.length < 6 ? <>
        <label>Choose PNG/JPG/JPEG</label>
        <input type="file" name="file" id="file_up" onChange={uploadPhoto} /></> : null}
      <div>
        {photos.length < 6 ? <div className="fileInput">
          <input placeholder="Link on photo" onChange={e => setphotosinput(e.target.value)} value={photosinput} />
          <button onClick={() => setphoto()}>Set photo</button></div> : null}
      </div>
      <button className="create" onClick={() => createQ()}>Create question</button>

    </div>
  )
}
export default Createquestion
