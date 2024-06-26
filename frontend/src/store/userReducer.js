// Documentation/frontend/store/userReducer.js

const initialState = {
    user: null,
};

function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'LOGOUT_USER':
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
}

export default userReducer;
