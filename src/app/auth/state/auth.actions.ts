import { Action } from '@ngrx/store';

export const AUTHENTICATE = '[AUTH] AUTHENTICATE';
export const UNAUTHENTICATE = '[AUTH] UNAUTHENTICATE';

export class Authenticate implements Action {
  readonly type = AUTHENTICATE;
}

export class Unauthenticate implements Action {
  readonly type = UNAUTHENTICATE;
}

export type AuthActions = Authenticate | Unauthenticate;
