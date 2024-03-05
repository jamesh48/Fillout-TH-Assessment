import * as msw from 'msw';
import mockResponse from './mockResponse.json';
import twoToms from './twoToms.json';
export const handlers = [
  // Intercept the "GET /resource" request.
  (msw as any).http.get(
    'https://api.fillout.com/v1/api/forms/cLZojxk94ous/submissions',
    () => {
      return (msw as any).HttpResponse.json(mockResponse);
    }
  ),
  (msw as any).http.get(
    'https://api.fillout.com/v1/api/forms/twoToms/submissions',
    () => {
      return (msw as any).HttpResponse.json(twoToms);
    }
  ),
];
