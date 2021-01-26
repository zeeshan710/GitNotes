import {
    USER_LOGIN_AUTHORIZATION_SUCCESS,
    USER_LOGGEDOUT,
    MOVE_TO_PROFILE_SCREEN_SUCCESS,
    MOVE_TO_HOME_SCREEN,
    MOVE_TO_GIST_SCREEN,
    FETCH_USER_GIST,
    FETCH_USER_GIST_SUCCESS

} from '../types'
import { fetchCall } from '../../utils'
import { setLoading } from './gistsActions'

export const userAuthorizationSuccess = (auth) => {

    return {
        type: USER_LOGIN_AUTHORIZATION_SUCCESS,
        payload: auth
    }
}

export const userloggedout = () => {
    return {
        type: USER_LOGGEDOUT,
    }
}

export const moveToProfileScreenSuccess = () => {
    return {
        type: MOVE_TO_PROFILE_SCREEN_SUCCESS,
    }
}

export const moveToHomeScreen = () => {
    return {
        type: MOVE_TO_HOME_SCREEN
    }
}


export const fetchUserGistsSuccess = gists => {
    return {
        type: FETCH_USER_GIST_SUCCESS,
        payload: gists
    }
}

export const moveToGistScreen = (val) => {
    return {
        type: MOVE_TO_GIST_SCREEN,
        payload: val
    }
}

export const myGistsData = () => {
    return async (dispatch, getState) => {

        dispatch(setLoading(true))
        const state = await getState();
        const { user } = state
        const data = await fetchCall(`https://api.github.com/users/mirzazeeshan-emumba/gists`, {
            method: "get",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.accessToken}`,
            },
        });
        dispatch(fetchUserGistsSuccess(data.response));
        dispatch(setLoading(false))

    }
}




