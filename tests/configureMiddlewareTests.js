import { expect } from 'chai';
import sinon from 'sinon';
import configureMiddleware from '../source/configureMiddleware';

const getState = () => ({ name: 'roger' });

const createMixpanelStub = () => ({ track: sinon.spy() });

const createStoreStub = () => ({ getState: sinon.spy(getState) });

const createTrackingMetadata = (payload = { name: 'link' }) => ({
  mixpanel: { event: 'click', payload },
});

const noop = () => {};

describe('configureMiddleware', () => {
  it('should return a function.', () => {
    expect(configureMiddleware()).to.be.a('function');
  });

  it('should track mixpanel events if a mixpanel instance is provided.', () => {
    const mixpanel = createMixpanelStub();
    const middleware = configureMiddleware(mixpanel)(createStoreStub());

    middleware(noop)({ type: 'action', meta: createTrackingMetadata() });
    expect(mixpanel.track).to.have.callCount(1);
  });

  it('should pass through action when tracking is unavailable.', () => {
    const next = sinon.spy();
    const middleware = configureMiddleware()(createStoreStub());

    middleware(next)({ type: 'action', meta: createTrackingMetadata() });
    expect(next).to.have.callCount(1);
  });

  it('should pass through action when tracking.', () => {
    const next = sinon.spy();
    const middleware = configureMiddleware(createMixpanelStub())(createStoreStub());

    middleware(next)({ type: 'action', meta: createTrackingMetadata() });
    expect(next).to.have.callCount(1);
  });

  it('should track object payload.', () => {
    const mixpanel = createMixpanelStub();
    const middleware = configureMiddleware(mixpanel)(createStoreStub());
    const metadata = createTrackingMetadata();

    middleware(noop)({ type: 'action', meta: metadata });
    expect(mixpanel.track).to.have.been.calledWithExactly(
      metadata.mixpanel.event,
      metadata.mixpanel.payload,
    );
  });

  it('should call function payloads with current state before dispatch.', () => {
    const mixpanel = createMixpanelStub();
    const middleware = configureMiddleware(mixpanel)(createStoreStub());
    const payload = sinon.spy(state => state.name);
    const metadata = createTrackingMetadata(payload);

    middleware(noop)({ type: 'action', meta: metadata });
    expect(payload).to.have.been.calledWith({ name: 'roger' });
    expect(mixpanel.track).to.have.been.calledWithExactly(metadata.mixpanel.event, 'roger');
  });
});
