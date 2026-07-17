import { sharedSchemas } from './shared-schemas.js';

describe('sharedSchemas', () => {
  it('should work', () => {
    expect(sharedSchemas()).toEqual('shared-schemas');
  });
});
