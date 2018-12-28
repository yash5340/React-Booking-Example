import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { AjaxCreationMethod } from 'rxjs/internal/observable/dom/AjaxObservable';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Action as SsrAction } from '../ssr/types';
import { State } from '../store';
import { Action, BookDetailReceivedAction, GetBookDetailAction } from './types';

function bookDetailEpic(
  action$: Observable<Action>,
  state$: Observable<State>,
  { ajax }: { ajax: AjaxCreationMethod },
): Observable<any> {
  return action$.pipe(
    filter(
      (value: Action) => value.type === 'react-book-search/bookDetail/GET_BOOK_DETAIL'
    ),
    mergeMap(value => ajax({
      url: `http://localhost:3001/api/books/${(value as GetBookDetailAction).payload.bookId}`,
    }).pipe(
      map(result => ({
        type: 'react-book-search/bookDetail/BOOK_DETAIL_RECEIVED',
        payload: {
          bookDetail: result.response,
        },
      })),
    ))
  );
}

function setSsrReady(action$: Observable<any>): Observable<any> {
  return action$.pipe(
    filter(
      (value: Action) => Boolean(process.env.SERVER)
        && value.type
          === 'react-book-search/bookDetail/BOOK_DETAIL_RECEIVED',
    ),
    map(() => ({
      type: 'react-book-search/ssr/RENDER_READY',
      payload: {
        ready: true,
      },
    })),
  );
}

export default combineEpics(bookDetailEpic, setSsrReady);