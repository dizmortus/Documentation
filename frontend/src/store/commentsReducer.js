// Documentation/frontend/store/commentsReducer.js

const initialState = {
    comments: [],
};

function commentsReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_COMMENTS':
            return {
                ...state,
                comments: action.payload,
            };
        case 'ADD_COMMENT':
            return {
                ...state,
                comments: [...state.comments, action.payload],
            };
        case 'REMOVE_COMMENT':
            return {
                ...state,
                comments: state.comments.filter(comment => comment.id !== action.payload),
            };
        default:
            return state;
    }
}

export default commentsReducer;
