import { expect } from 'chai';
import * as tracking from '../source/tracking';
import configureMiddleware from '../source/configureMiddleware';
import track from '../source/track';

describe('tracking', () => {
  it('should expose "track" action creator.', () => {
    expect(tracking.track).to.equal(track);
  });

  it('should expose "configureMiddleware".', () => {
    expect(tracking.configureMiddleware).to.equal(configureMiddleware);
  });
});
