//Файл Documentation/frontend/store/pagesReducer.js

const initialState = {
    pages: [],
    pageCount: 0,
};

const pagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PAGES':
            return {
                ...state,
                pages: action.payload,
                pageCount: action.payload.length,
            };
        case 'ADD_PAGE':
            return {
                ...state,
                pages: [...state.pages, action.payload],
                pageCount: state.pageCount + 1,
            };
        case 'REMOVE_PAGE':
            return {
                ...state,
                pages: state.pages.filter(page => page.id !== action.payload),
                pageCount: state.pageCount - 1,
            };
        default:
            return state;
    }
};

export default pagesReducer;