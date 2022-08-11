import { Dispatch } from "react";
import { 
    ApplicationAction, 
    ApplicationActionsType,
    ApplicationMode,
    ApplicationPage
} from "../../dtos/applicationDto";
import { IConnection } from "../../dtos/connectionsDto";
import { IConfiguredPublisher } from "../../dtos/MQTTEntities";

export const changePage = (page: ApplicationPage, connection?: IConnection) => {
    return (dispatch: Dispatch<ApplicationAction>) => {
        dispatch({
            type: ApplicationActionsType.CHANGE_PAGE,
            page,
            connection
        })
    }
}

export const changeMode = (mode?: ApplicationMode, publisher?: IConfiguredPublisher) => {
    return (dispatch: Dispatch<ApplicationAction>) => {
        dispatch({
            type: ApplicationActionsType.CHANGE_MODE,
            mode,
            publisher
        })
    }
}