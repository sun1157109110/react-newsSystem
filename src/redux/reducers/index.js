import { combineReducers } from "redux";
import { CollapsedReducer } from "./CollapsedReducer";
import { SpinningReducer } from "./SpinningReducer";


export const reducer = combineReducers({CollapsedReducer,SpinningReducer})