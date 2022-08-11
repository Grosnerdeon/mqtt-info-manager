import { 
    IApplicationState,
    ApplicationAction,
    ApplicationPage,
    ApplicationActionsType 
} from "../../dtos/applicationDto";

const initialState: IApplicationState = {
    currentPage: ApplicationPage.CONNECTIONS
}

export const applicationReducer = 
    (state = initialState, action: ApplicationAction): IApplicationState => {
    switch(action.type) {
        case ApplicationActionsType.CHANGE_PAGE: {
            return { 
                ...state,
                connection: action.connection,
                currentPage: action.page
            }
        }
        case ApplicationActionsType.CHANGE_MODE: {
            return {
                ...state,
                publisher: action.publisher,
                currentMode: action.mode
            }
        }
        default:
            return state
    }
}