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
 * @returns {function}
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
    }

    return data.payload;
  };

  /**
   * Tries to resolve the mixpanel api by determining if the mixpanel argument is a thunk or the
   * actual api. If a thunk is provided, it usually means that mixpanel is being loaded asyncly
   * and might not be availble during configuration.
   *
   * @returns {object}
   */
  const getApi = () => {
    if (typeof mixpanel === 'function') {
      return mixpanel();
    }

    return mixpanel;
  };

  return next => (action) => {
    const api = getApi();

    if (api != null && isMixpanelAction(action)) {
      try {
        api.track(action.meta.mixpanel.event, getEventPayload(action.meta.mixpanel));
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
