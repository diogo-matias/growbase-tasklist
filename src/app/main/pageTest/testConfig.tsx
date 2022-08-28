import { lazy } from 'react';

const Test = lazy(() => import('./Test'));

const TestConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/test',
      element: <Test />,
    },
  ],
};

export default TestConfig;
