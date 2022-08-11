import { Dispatch } from "react";
import {
    NotificationsAction,
    NotificationsActionsType,
    NotificationsType 
} from "../../dtos/notificationsDto";

export const showNotification = (message: string, notificationType: NotificationsType) => {
    return (dispatch: Dispatch<NotificationsAction>) => {
        dispatch({
            type: NotificationsActionsType.SHOW_NOTIFICATION,
            payload: message,
            notificationType 
        })
    }
}

export const hideNotification = () => {
    return (dispatch: Dispatch<NotificationsAction>) => {
        dispatch({
            type: NotificationsActionsType.HIDE_NOTIFICATION
        })
    }
}