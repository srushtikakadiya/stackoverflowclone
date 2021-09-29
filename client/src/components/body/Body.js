import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import ActivationEmail from './auth/ActivationEmail'
import NotFound from '../utils/NotFound/NotFound'
import Createquestion from '../body/createquestion/Createquestion'
import Notifications from '../body/notifications/Notifications'


import ForgotPass from '../body/auth/ForgotPassword'
import ResetPass from '../body/auth/ResetPassword'

import Admin from '../body/admin/Admin'
import Settings from '../body/settings/Settings'

import EditUser from '../body/profile/EditUser'

import Home from '../body/home/Home'
import User from '../body/user/User'
import Users from '../body/users/Users'


import Question from '../body/question/Question'
import EditQuestion from '../body/question/EditQuestion'
import EditAnswear from '../body/question/EditAnswear'


import {useSelector} from 'react-redux'

function Body() {
    const auth = useSelector(state => state.auth)
    const {isLogged, isAdmin} = auth
    return (
        <section>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/questions" component={Home} exact />
                <Route path="/question/:questionId" component={Question} exact />
                <Route path="/answear/:answearId/edit" component={isLogged ? EditAnswear : Login} exact />
                <Route path="/question/:questionId/edit" component={isLogged ? EditQuestion : Login} exact />
                <Route path="/notifications" component={isLogged ? Notifications : Login} exact />
                <Route path="/users" component={Users} exact />
                <Route path="/user/:userId" component={User} exact />
                <Route path="/login" component={isLogged ? NotFound : Login} exact />
                <Route path="/register" component={isLogged ? NotFound : Register} exact />
                <Route path="/forgot_password" component={isLogged ? NotFound : ForgotPass} exact />
                <Route path="/user/reset/:token" component={isLogged ? NotFound : ResetPass} exact />
                <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />
                <Route path="/settings" component={isLogged ? Settings : NotFound} exact />
                <Route path="/create" component={isLogged ? Createquestion : NotFound} exact />
                <Route path="/admin" component={isAdmin ? Admin : NotFound} exact />
                <Route path="/edit_user/:id" component={isAdmin ? EditUser : NotFound} exact />
            </Switch>
        </section>
    )
}

export default Body
