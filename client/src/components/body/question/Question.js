import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import "./Question.css"
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDone } from 'react-icons/md';
function Question(props) {
  const questionId = props.match.params.questionId;
  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)
  const [photos, setphotos] = useState([])

  const [photosinput, setphotosinput] = useState('')
  const [answeartext, setansweartext] = useState('')
  const [question, setquestion] = useState({})
  const [answears, setanswears] = useState([])
  const [reload, setreload] = useState(false)

  const [comments, setcomments] = useState([])
  const [commentInput, setcommentInput] = useState("")


  useEffect(() => {

    axios.get(`/api/question/${questionId}`).then(
      d => {
        if (d.data.redirect)
          props.history.push("/")
        else {
          setquestion(d?.data?.question[0])
        }
      }
    )

    axios.get(`/api/answear/fromquestion/${questionId}`).then(
      d => setanswears(d?.data?.answears?.sort((a, b) => (a.likes.length < b.likes.length) ? 1 : ((b.likes.length < a.likes.length) ? -1 : 0))
      )
    )
    axios.get(`/api/comment/${questionId}`).then(
      d => { setcomments(d.data.comments) }
    )
  }, [token, questionId, auth, reload])


  const dropPhoto = i => {
    let pushArray = []
    for (let y = 0; y < photos.length; y++) {
      if (y != i)
        pushArray.push(photos[y])
    }
    setphotos(pushArray)
  }

  const setphoto = () => {
    if (photos.indexOf(photosinput) == -1 && photosinput.length) {
      setphotos([...photos, photosinput])
      setphotosinput('')
    }
  }
  const createAnswear = async () => {
    if (answeartext.length > 0) {
      const res = await axios.post('/api/answear/create', { questionId, photos, answeartext }, {
        headers: { Authorization: token }
      })
      if (res.data.reload) {
        setreload(!reload)
        setphotosinput("")
        setansweartext("")
        setphotos([])
      }
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

      const res = await axios.post('/api/answear/uploadimage', formData, {
        headers: { 'content-type': 'multipart/form-data', Authorization: token }
      })

      setphotos([...photos, res.data.url])

    } catch (err) {
      console.log({ err: err.response.data.msg, success: '' })
    }
  }

  const upVoteQ = async () => {
    const res = await axios.post(`/api/question/vote/${questionId}`, {}, {
      headers: { Authorization: token }
    })
    if (res?.data?.reload)
      setreload(!reload)
  }

  const upVoteA = async (answearId) => {
    const res = await axios.post(`/api/answear/vote/${answearId}`, {}, {
      headers: { Authorization: token }
    })
    if (res?.data?.reload)
      setreload(!reload)
  }

  const deleteAnswear = async (del_id) => {
    const res = await axios.delete(`/api/answear/${del_id}`, {
      headers: { Authorization: token }
    })
    if (res?.data?.removed)
      props.history.push("/")

  }


  const deleteQuestion = async (del_id) => {
    const res = await axios.delete(`/api/question/${del_id}`, {
      headers: { Authorization: token }
    })
    if (res?.data?.removed)
      props.history.push("/")
  }
  const isAnsweared = async () => {
    if (question?.writer?._id == auth?.user?._id || auth?.isAdmin) {
      const res = await axios.patch(`/api/question/setansweared/${question?._id}`, {}, {
        headers: { Authorization: token }
      })
      if (res?.data?.reload)
        setreload(!reload)
    }
  }
  const createComment = async () => {
    if (commentInput.length) {
      const res = await axios.post(`/api/comment/${question?._id}`, { commentInput }, {
        headers: { Authorization: token }
      })
      if (res?.data?.reload) {
        setreload(!reload)
        setcommentInput("")
      }
    }
  }

  const deleteComment = async (id) => {
    const res = await axios.delete(`/api/comment/${id}`, {
      headers: { Authorization: token }
    })
    if (res?.data?.reload) {
      setreload(!reload)
    }
  }

  const createReportOnQuestion = async () => {
    const res = await axios.post(`/api/notifications`, {
      questionId,
      on: "Question",
      type: "Report",
      text: "Report on question"
    }, {
      headers: { Authorization: token }
    })
    if (res?.data?.notification) {
      alert("Report was sent!")
    }
  }
  return (
    question._id ?
      <div className="questionComponent">
        <div className="questionComponentBody">

          <div className="questionComponentBodyLikes">
            <button className={"questionComponentBodyIsAnsweared " + (question?.answered ? "yes" : "")} onClick={() => isAnsweared()}>
              <MdDone />
            </button>
            <button className={"questionComponentBodyLikesBtn " + (question?.likes?.indexOf(auth?.user?._id) != -1 ? "Liked" : "")} onClick={() => upVoteQ()}>
              <AiOutlinePlus />
            </button>
            <div>{question?.likes?.length}</div>
          </div>
          <div className="questionComponentBodyExact">

            <div className="questionComponentBodyExactTitle">
              {question?.title}
            </div>


            <pre className="questionComponentBodyExactDescription">
              {question?.description}
            </pre>
            {question?.images?.length ?
              <div className="questionComponentBodyExactImages">
                {question?.images?.map((t, i) => <img key={i} src={t}></img>)}

              </div> : null
            }
            <div className="questionComponentBodyExactTags">
              {question?.tags?.map((t, i) => <span key={i}>{t}</span>)}
            </div>

            {(auth.user.role || auth?.user?._id == question?.writer?._id) ?

              <div className="questionComponentBodyExactControl">
                <button className="delete" onClick={() => deleteQuestion(questionId)}>
                  Delete
            </button>
                <Link className="edit" to={"/question/" + questionId + "/edit"}>Edit</Link>
              </div> : (
                auth.isLogged ?
                  <div className="questionComponentBodyExactControl">
                    <button className="delete" onClick={() => createReportOnQuestion()}>
                      Report
                    </button>
                  </div> :
                  null
              )
            }
          </div>
        </div>
        {(auth.isLogged || comments.length) ?
          <div className="comments_section">
            <div className="comments_section_title">Comments</div>
            {auth.isLogged ?
              <div className="comments_section_control">
                <input value={commentInput} onChange={e => setcommentInput(e.target.value)}></input>
                <button onClick={() => createComment()}>Create comment</button>
              </div> : null
            }
            <div className="comments_map">
              {comments.map((c, i) => <div key={i} className="comment"><div>{c.description}</div>
                {(c.writer == auth.user._id || auth.isAdmin) ?
                  <button onClick={() => deleteComment(c._id)}>X</button> : null
                }
              </div>)}
            </div>
          </div> : null
        }
        {auth.isLogged ?
        <div className="inputForm">
          <div className="inputFormTitle">Create answer</div>
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
          <button className="create" onClick={() => createAnswear()}>Create Answer</button>
        </div>:null}



        {answears?.length &&
          <div className="answearsMap">
            <div className="answearsMapTitle">Answers</div>
            {answears?.map((a, i) =>
              <div className="answear" key={i}>
                <div className="answearBody">
                  <div className="answearVote">
                    <button className={"answearVote " + (a?.likes?.indexOf(auth?.user?._id) != -1 ? "Liked" : "")} onClick={() => upVoteA(a._id)}>
                      <AiOutlinePlus />
                    </button>
                    <div className="answearVoteLength">{a?.likes?.length}</div>
                  </div>
                  <div className="answearMainContent">
                    <div>{a.description}</div>
                    <div className="answearMainContentImgMap">{a.images.map((i, ii) => <img key={ii} src={i}></img>)}</div>
                  </div>
                </div>

                {
                  (a.writer._id == auth.user._id || auth.isAdmin) ?
                    <div className="answearMainContentControl">
                      <button className="delete" onClick={() => deleteAnswear(a._id)}>Delete</button>
                      <Link to={"/answear/" + a._id + "/edit"}>Edit</Link>
                    </div> : null
                }

              </div>
            )}

          </div>
        }
      </div> :
      <div> Loading</div>
  )
}

export default Question