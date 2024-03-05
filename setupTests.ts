/**
 * @jest-environment node
 */
import { server } from './msw';

beforeAll(() => {
  server.listen();
});

afterAll(() => server.close());
