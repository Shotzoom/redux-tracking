Shotzoom tracking middleware
============================

Provides tracking support for redux. Currently only support mixpanel.

## Installation 

```bash
  npm install @shotzoom/redux-tracking --save
```

## Usage

Tracking is done by first applying the tracking middleware to your redux store and then dispatching actions with tracking meta data or by using the `track` action creator.

```js
import { createStore, applyMiddleware } from 'redux';
import { configureMiddleware } from '@shotzoom/redux-tracking';
import reducer from './reducer';

const middleware = applyMiddleware(configureMiddleware(mixpanel));
const store = createStore(reducer, middleware);
```

After the middleware has been applied to the store, simply dispatch actions with tracking metadata.

```js
const viewMore = (page) => {
  return {
    type: 'VIEW_MORE',
    meta: {
      mixpanel: {
        event: 'view more',
        payload: { page: page }
      }
    }
  };
};

store.dispatch(viewMore(10));
```

Instead of using an object payload, a function can be supplied. When a function is used as payload, it will be called by the middleware with the current store state as its only argument and its result will be used as the tracking payload.

```js
const viewMore = (page) => {
  return {
    type: 'VIEW_MORE',
    meta: { 
      mixpanel: {
        event: 'view more',
        payload: (state) => {
          return {
            query: state.query,
            page: page
          };
        }
      }
    }
  };
};

store.dispatch(viewMore(10));
```

If tracking is needed without dispatching any action, you can simply use the `track` action creator.

```js
import { track } from '@shotzoom/redux-tracking';

dispatch(track('view more', { page: 10 }));
dispatch(track('view more', (state) => { query: state.query }));
```
