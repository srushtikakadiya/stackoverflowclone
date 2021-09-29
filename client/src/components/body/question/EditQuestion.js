import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import "./Question.css"

function EditQuestion(props) {
  const [questiontext, setquestiontext] = useState('')
  const [questiontitle, setquestiontitle] = useState('')


  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)
  const questionId = props.match.params.questionId;
  const [photos, setphotos] = useState([])
  const [photosinput, setphotosinput] = useState('')
  const [tags, settags] = useState([])
  const [taginput, settaginput] = useState('')
  const dropPhoto = i => {
    let pushArray = []
    for (let y = 0; y < photos.length; y++) {
      if (y != i)
        pushArray.push(photos[y])
    }
    setphotos(pushArray)
  }

  useEffect(() => {
    axios.post(`/api/question/get/${questionId}`, {}, {
      headers: { Authorization: token }
    }).then(d => {
      console.log(d)
      if (d.data.redirect)
        props.history.push("/");
      else if (d?.data?.question) {
        setphotos(d?.data.question.images)
        setquestiontext(d?.data?.question.description)
        setquestiontitle(d?.data.question.title)
        settags(d?.data.question.tags)
      }
    })

  }, [token, questionId, auth])
  const submitQuestionChanges = async () => {
    if (questiontext.length > 0) {
      const res = await axios.patch(`/api/question/${questionId}`, { photos, questiontext, questiontitle, tags }, {
        headers: { Authorization: token }
      })
      if (res?.data?.reload)
        props.history.push("/question/" + questionId)
      console.log(res)
    }

  }
  const uploadPhoto = async (e) => {
    e.preventDefault()
    try {
      const file = e.target.files[0]

      if (!file) console.log({ err: "No files were uploaded.", success: '' })

      if (file.size > 1024 * 1024)
        console.log({ err: "Size too large.", success: '' })

      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.mimetype !== 'image/jpg')
        console.log({ err: "File format is incorrect.", success: '' })

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
  const setphoto = () => {
    if (photos.indexOf(photosinput) == -1 && photosinput.length) {
      setphotos([...photos, photosinput])
      setphotosinput('')
    }
  }
  const dropTag = i => {
    let pushArray = []
    for (let y = 0; y < tags.length; y++) {
      if (y != i)
        pushArray.push(tags[y])
    }
    settags(pushArray)
  }
  const settag = () => {
    if (tags.indexOf(taginput) == -1 && taginput.length) {
      console.log(taginput)
      settags([...tags, taginput])
      settaginput('')
    }
  }

  return (

    <div className="inputForm">
      <input className="TitleInput" placeholder="Title" value={questiontitle} onChange={e => setquestiontitle(e.target.value)}></input>
      <textarea className="DescriptionInput" placeholder="Body" value={questiontext} onChange={e => setquestiontext(e.target.value)}></textarea>

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
      <button className="create" onClick={() => submitQuestionChanges()}>Update question</button>

    </div>

  )
}

export default EditQuestion