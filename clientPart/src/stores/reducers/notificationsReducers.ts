import { 
    NotificationsAction, 
    NotificationsActionsType,
    INotificationsState
} from '../../dtos/notificationsDto'

const initialState: INotificationsState = {
    showNotifications: false
}

export const notificationsReducer = 
    (state = initialState, action: NotificationsAction): INotificationsState => {
    switch(action.type) {
        case NotificationsActionsType.SHOW_NOTIFICATION: {
            return { 
                ...state, 
                showNotifications: true, 
                type: action.notificationType, 
                message: action.payload 
            }
        }
        case NotificationsActionsType.HIDE_NOTIFICATION: {
            return {
                ...state,
                showNotifications: false
            }
        }
        default:
            return state
    }
}