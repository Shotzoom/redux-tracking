import { expect } from 'chai';
import track from '../source/track';

describe('track', () => {
  it('should create a trackable action.', () => {
    const action = track('click', { name: 'subscribe link' });

    expect(action).to.have.property('type');
    expect(action).to.have.property('meta');
    expect(action.meta).to.have.property('mixpanel');
    expect(action.meta.mixpanel).to.have.property('event', 'click');
    expect(action.meta.mixpanel).to.have.property('payload');
    expect(action.meta.mixpanel.payload).to.have.property('name', 'subscribe link');
  });
});
