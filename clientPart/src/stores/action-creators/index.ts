import * as ConnectionActionCreators from './connections';
import * as NotificationActionCreators from './notifications';
import * as ApplicationActionCreators from './application';

export default {
    ...ConnectionActionCreators,
    ...NotificationActionCreators,
    ...ApplicationActionCreators
}