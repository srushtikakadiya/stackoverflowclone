import {combineReducers} from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import notifications from './notificationsReducer'

export default combineReducers({
    auth,
    token,
    notifications 
})