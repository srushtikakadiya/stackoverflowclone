import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import "./Question.css"


function EditAnswear(props) {
  const [answeartext, setansweartext] = useState('')

  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)
  const answearId = props.match.params.answearId;
  const [photos, setphotos] = useState([])
  const [photosinput, setphotosinput] = useState('')
  const [answearid, setanswearid] = useState('')

  const dropPhoto = i => {
    let pushArray = []
    for (let y = 0; y < photos.length; y++) {
      if (y != i)
        pushArray.push(photos[y])
    }
    setphotos(pushArray)
  }

  useEffect(() => {
    axios.post(`/api/answear/get/${answearId}`, {}, {
      headers: { Authorization: token }
    }).then(d => {
      if (d.data.redirect)
        props.history.push("/");
      else if (d?.data?.answear) {
        setphotos(d?.data.answear.images)
        setansweartext(d?.data.answear.description)
        setanswearid(d?.data?.answear?.question?.toString())
      }
    })

  }, [token, answearId, auth])
  const submitAnswearChanges = async () => {
    // axios.post()
    if (answeartext.length > 0) {
      const res = await axios.patch(`/api/answear/${answearId}`, { photos, answeartext }, {
        headers: { Authorization: token }
      })
      // console.log(res)
      if (res?.data?.redirect) {
        props.history.push("/question/" + answearid)
      }

    }
    console.log(answeartext, photos, answearId)
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

      // setLoading(true)
      const res = await axios.post('/api/answear/uploadimage', formData, {
        headers: { 'content-type': 'multipart/form-data', Authorization: token }
      })

      // setLoading(false)
      console.log(res.data)
      setphotos([...photos, res.data.url])

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


  return (


    <div className="inputForm">
      <textarea className="DescriptionInput" placeholder="Body" value={answeartext} onChange={e => setansweartext(e.target.value)}></textarea>


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
      <button className="create" onClick={() => submitAnswearChanges()}>Update question</button>

    </div>

  )
}

export default EditAnswear