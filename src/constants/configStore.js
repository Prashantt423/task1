import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
};

const initial_state = {
 connectedEdges:[],
 workFlowName:""
};

function reducer(state = initial_state, action) {
  switch (action.type) {
    case "edge":
      return {
        ...state,
        connectedEdges: action.value,
      };
    case "workFlowName":
      return {
        ...state,
        workFlowName: action.value,
      };
    default:
      return state;
  }
}

const persistedReducer = persistReducer(persistConfig, reducer);
let store = createStore(persistedReducer);
let persistor = persistStore(store);

export { store, persistor };
