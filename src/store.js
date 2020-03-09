import { createStore } from "redux";

const initialState = {
  user: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        user: action.user
      }
    default:
      break;
  }

  return state;
}

const store = createStore(reducer,
  typeof window === 'object' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ?
    window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);

export default store;