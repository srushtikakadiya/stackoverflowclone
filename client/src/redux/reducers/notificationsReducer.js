import ACTIONS from '../actions'

const notifications =[]

const usersReducer = (state = notifications, action) => {
    switch(action.type){
        case ACTIONS.NOTIFICATIONS:
            return action.payload
        default:
            return state
    }
}

export default usersReducer