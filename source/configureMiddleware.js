/**
 * Is the current action a mixpanel tracking action?
 *
 * @param {*} action
 * @returns {boolean}
 */
const isMixpanelAction = action =>
  action != null &&
  action.meta != null &&
  action.meta.mixpanel != null;

/**
 * Creates a custom configured middleware for mixpanel tracking.
 *
 * @param {*} mixpanel
 */
export default mixpanel => (store) => {
    /**
     * Computes mixpanel event payload. If that payload is a function, it will be called
     * with the current store state, otherwise the payload itself is used.
     *
     * @param {object} data
     * @return {object}
     */
  const getEventPayload = (data) => {
    if (typeof data.payload === 'function') {
      return data.payload(store.getState());
    } else if (data.payload != null) {
      return data.payload;
    }

    return data.payload;
  };

  return next => (action) => {
    if (mixpanel != null && isMixpanelAction(action)) {
      try {
        mixpanel.track(action.meta.mixpanel.event, getEventPayload(action.meta.mixpanel));
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          /* eslint-disable no-console */
          const error = `Failed to track event ${action.meta.mixpanel} with ${e}.`;

          if (typeof console !== 'undefined') {
            if (typeof console.error === 'function') {
              console.error(error);
            } else {
              console.log(error);
            }
          }
          /* eslint-enable no-console */
        }
      }
    }

    return next(action);
  };
};
