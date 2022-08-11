import { combineReducers } from "redux";
import { applicationReducer } from "./applicationReducers";
import { connectionReducer } from "./connectionReducer";
import { connectionsReducer } from "./connectionsReducers";
import { notificationsReducer } from "./notificationsReducers";

export const rootReducer = combineReducers({
    connections: connectionsReducer,
    notifications: notificationsReducer,
    application: applicationReducer,
    connection: connectionReducer
})

export type RootState = ReturnType<typeof rootReducer>