import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import './home.css'

function Home() {
    // const [limit,setlimit] = useState(3)
    const [limit, setlimit] = useState(20)
    const [page, setpage] = useState(0)
    const [search, setsearch] = useState("")
    const [tag, settag] = useState("")
    const [isansweared, setisansweared] = useState(false)
    const [AllQuestionsLength, setAllQuestionsLength] = useState(0)

    const [questions, setquestions] = useState([])
    const whithout_limit = 100

    useEffect(() => {
        axios.get(`/api/question?search=${search}&tag=${tag}&isansweared=${isansweared}&page=${page}&limit=${limit ? limit : whithout_limit}`)
            .then(data => {
                setAllQuestionsLength(data.data.lengthOfTheQuestions);
                setquestions(data.data.questions);
            })
    }, [search, limit, page, tag, isansweared])


    return (
        <div className="home_page">
            <div className="home_page_header">
                <input placeholder="Search by content" value={search} onChange={e => setsearch(e.target.value)} />
                <input placeholder="Search by tags" value={tag} onChange={e => settag(e.target.value)} />
                <button onClick={() => setisansweared(!isansweared)}>{isansweared ? "Answered" : "All"}</button>
            </div>
            <div className="questionsMap">
                {questions.map((q, i) => <div key={i} className={"question " + (q.answered ? "answeared" : "")} key={"question_" + i}>
                    <div className="questionTitle"><div className="isansweared"></div><Link to={"question/" + q._id}>{q.title}</Link></div>
                    <pre className="questionDescription">{q.description}</pre>
                    <div className="tagsMap">
                        {q.tags.map((t, index) => <div key={"tag_" + i + "_" + index}>{t}</div>)}
                    </div>
                </div>)}
            </div>

            <div className="page-controll">
                {
                    function () {
                        let btns = []
                        for (let l = 0; l < Math.ceil(AllQuestionsLength / (limit ? limit : whithout_limit)); l++) {
                            btns.push(<button key={l} onClick={() => setpage(l)}>{l}</button>)
                        }
                        return <div className="page-conroll-pages-list">{btns}</div>
                    }()
                }
                <div className="page-conroll-input">
                    <div className="page-conroll-input-label">Search limit</div>
                    <input className="page-conroll-input"
                        value={limit}
                        type="number"
                        placeholder={whithout_limit}
                        min="1" max="100"
                        onChange={e => setlimit(e.target.value)}></input>
                </div>
            </div>
        </div>
    )
}

export default Home
