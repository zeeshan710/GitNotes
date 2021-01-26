import {
    USER_LOGIN_AUTHORIZATION_SUCCESS,
    USER_LOGGEDOUT,
    MOVE_TO_PROFILE_SCREEN_SUCCESS,
    MOVE_TO_HOME_SCREEN,
    MOVE_TO_GIST_SCREEN,
    FETCH_USER_GIST,
    FETCH_USER_GIST_SUCCESS,

} from '../types'

const initialState = {
    isLoggedin: false,
    userDetail: {},
    accessToken: null,
    onProfileScreen: false,
    onHomeScreen: false,
    myGists: [],
    routeName: 'Your Gist'
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_AUTHORIZATION_SUCCESS: return {
            ...state,
            isLoggedin: true,
            accessToken: action.payload.accessToken,
            userDetail: action.payload.user
        }
        case USER_LOGGEDOUT: return {
            ...state,
            isLoggedin: false,
            accessToken: null,
            userDetail: {}
        }
        case MOVE_TO_PROFILE_SCREEN_SUCCESS: return {
            ...state,
            onProfileScreen: true,
            onHomeScreen: false,
            routeName: 'Public Gists'

        }
        case MOVE_TO_GIST_SCREEN: return {
            ...state,
            onProfileScreen: false,
            onHomeScreen: false,
            // redirectGistDetail: action.payload,
            routeName: 'Your Gists'
        }
        case MOVE_TO_HOME_SCREEN: return {
            ...state,
            onHomeScreen: true,
            onProfileScreen: false,
            routeName: 'Your Gists'

        }

        case FETCH_USER_GIST_SUCCESS: return {
            ...state,

            myGists: action.payload
        }

        default: return state
    }
}

export default userReducer;