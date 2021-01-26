import {
    FETCH_PUBLIC_GISTS_SUCCESS,
    SET_IS_USER_GIST,

    FETCH_GRID_DATA,
    SEARCH_GIST,
    SET_VISITED_PAGE

} from '../types';

const initialState = {
    publicGists: [],
    gridData: [],
    isUserGist: false,
    searchId: '',
    visitedPages: []
}

const gistsReducer = (state = initialState, action) => {
    switch (action.type) {

        case FETCH_PUBLIC_GISTS_SUCCESS: return {
            ...state,
            publicGists: state.publicGists.concat(action.payload)

        }
        case SET_IS_USER_GIST: return {
            ...state,
            isUserGist: action.payload
        }
        // case SET_LOADING: return {
        //     ...state,
        //     loading: action.payload
        // }
        case FETCH_GRID_DATA: return {
            ...state,
            gridData: state.gridData.concat(action.payload)
        }
        case SEARCH_GIST: return {
            ...state,
            searchId: action.payload
        }
        case SET_VISITED_PAGE: return {
            ...state,
            visitedPages: state.visitedPages.concat(action.payload)
        }

        default: return state
    }
}

export default gistsReducer;