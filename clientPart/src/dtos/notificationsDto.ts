import { IConnection } from "./connectionsDto";

export enum NotificationsActionsType {
    SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
    HIDE_NOTIFICATION = 'HIDE_NOTIFICATION' 
}

export interface IError {
    message: string
}

export enum NotificationsType {
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    INFO = 'INFO'
}

export interface IShowNotificationAction {
    type: NotificationsActionsType.SHOW_NOTIFICATION
    notificationType: NotificationsType
    payload: string;
}

export interface IHideNotificationAction {
    type: NotificationsActionsType.HIDE_NOTIFICATION
}

export interface INotificationsState {
    message?: string
    showNotifications: boolean,
    type?: NotificationsType
}

export type NotificationsAction = 
    IShowNotificationAction |
    IHideNotificationAction;