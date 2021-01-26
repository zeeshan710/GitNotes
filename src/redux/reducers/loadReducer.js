import {
    SET_LOADING

} from '../types'

const loading = {
    status: false
};

const loadReducer = (state = loading, action) => {

    switch (action.type) {
        case SET_LOADING: return {
            ...state,
            status: action.payload
        }

        default: return state;
    }
}

export default loadReducer;