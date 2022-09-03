import { avatarConstants } from '../_constants';

export function avatars(state : any = {
  initial: true,
  items: []
}, action:any) {
  switch (action.type) {
    case avatarConstants.GETOTHER_REQUEST:
    case avatarConstants.GETALL_REQUEST:
      return {...state,
        initial: false,
        loading: true
      };
    case avatarConstants.GETALL_SUCCESS:
      return {...state,
        items: action.avatars,
        loaded: true,
        initial: false,
      };
    case avatarConstants.GETALL_FAILURE:
      return { 
        loaded: false
      };
    case avatarConstants.GETOTHER_SUCCESS:
      return {
        item: action.avatars,
        loaded: true
      };
    case avatarConstants.GETOTHER_FAILURE:
      return {
        loaded: false,
      }
    default:
      return state
  }
}
