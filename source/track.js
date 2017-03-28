/**
 * Create an action that will just track data.
 *
 * @param {string} event
 * @param {(object|function)} payload
 * @returns {object}
 */
export default (event, payload) => ({
  type: '@@tracking/track',
  meta: {
    mixpanel: { event, payload },
  },
});
