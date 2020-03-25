import { createStore } from "redux";

const initialState = {
  verticalMenu: {
    defaultSelectedKeys: 'dashboard',
    inlineCollapsed: true
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VERTICAL_MENU':
      return {
        ...state,
        verticalMenu: action.verticalMenu
      }

    default:
      return state;
  }
}

const store = createStore(reducer,
  typeof window === 'object' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ?
    window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);

export default store;