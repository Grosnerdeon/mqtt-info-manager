import { 
    IConnectionsState, 
    connectionActionsType,
    connectionsAction
} from "../../dtos/connectionsDto"

const initialState: IConnectionsState = {
    connections: new Map(),
    loading: false,
    error: null
}

export const connectionsReducer = (state = initialState, action: connectionsAction): IConnectionsState => {
    switch (action.type) {
        case connectionActionsType.FETCH_CONNECTIONS: {
            if (action.connections) {
                return { ...state, loading: action.loading, error: action.error, connections: action.connections };
            }

            return { ...state, loading: action.loading, error: action.error };
        }
        case connectionActionsType.CREATE_CONNECTION: {
            if (action.connection) {
                state.connections.set(action.connection.id, action.connection);
            }

            return { ...state, loading: action.loading, error: action.error };
        }
        case connectionActionsType.DELETE_CONNECTION: {
            if (action.id && state.connections.has(action.id)) {
                state.connections.delete(action.id);
            }

            return { ...state, loading: action.loading, error: action.error };
        }
        case connectionActionsType.UPDATE_CONNECTION: {
            if (action.connection) {
                state.connections.set(action.connection.id, action.connection);
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.CLOSE_CONNECTION: {
            return { ...state, loading: action.loading, error: action.error }
        }
        default:
                return state;
    }
}