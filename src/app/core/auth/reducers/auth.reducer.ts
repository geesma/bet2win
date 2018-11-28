import * as AuthActions from '../actions/auth.action';
import { AuthActionTypes } from '../actions/auth.action';

export interface State {
  user: Array<any>;
  tokens: Array<any>;
  error: string;
  isLoading: boolean;
}

const initiaState: State = {
  user: [],
  tokens: [],
  error: '',
  isLoading: false
}

export function AuthReducer(state = [], action: AuthActions.actions) {
  switch(action.type) {
    case AuthActionTypes.LoginUser:
      return {
        ...state,
        isLoading: true,
        token: action.payload
      };
    case AuthActionTypes.LoggedUser:
      return {
        ...state,
        isLoading: false,
        token: action.payload
      }
    case AuthActionTypes.LoginUserError:
      return {
        ...state,
        isLoading: false,
        error: 'Email or password incorrect'
      };
    default:
      return state;
  }
}

export const getAuthState = (state: State) => state.user;
export const getAuthAction = (action: any) => action.payload;
export const getAuthError = (state: any) => state.error;
export const getAuthLoading = (state: State) => state.isLoading;
