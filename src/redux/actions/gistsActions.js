import {
    FETCH_PUBLIC_GISTS_SUCCESS,
    SET_IS_USER_GIST,
    SET_LOADING,
    FETCH_GRID_DATA,
    SEARCH_GIST,
    SET_VISITED_PAGE,


} from '../types'


export const fetchPublicGistsSucess = users => {
    return {
        type: FETCH_PUBLIC_GISTS_SUCCESS,
        payload: users
    }
}

export const setIsUserGist = (value) => {
    return {
        type: SET_IS_USER_GIST,
        payload: value
    }
}

export const setLoading = (value) => {
    return {
        type: SET_LOADING,
        payload: value
    }
}
export const setGridData = gists => {
    return {
        type: FETCH_GRID_DATA,
        payload: gists
    }
}

export const searchGist = (id) => {
    return {
        type: SEARCH_GIST,
        payload: id
    }
}
export const setVisitedPage = (pageNo) => {
    return {
        type: SET_VISITED_PAGE,
        payload: [pageNo]
    }
}

const accessToken = () => {
    return async (dispatch, getState) => {
        const state = await getState();
        return state.user.accessToken;
    }
}

export const checkUserGist = (ownerId) => {
    return async (dispatch, getState) => {
        const state = await getState();
        const { user } = state;
        const { userDetail } = user;

        userDetail.id === ownerId ? dispatch(setIsUserGist(true)) : dispatch(setIsUserGist(false))
    }


}

export const starClick = () => {
    return async (dispatch) => {
        const token = await accessToken();
        console.log('Final token',)
    }
}



