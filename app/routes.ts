import { type RouteConfig, index } from "@react-router/dev/routes";
import React from 'react';
import Dashboard from './routes/dashboard';

export const routes = [
  index("routes/home.tsx"),
  {
    path: '/dashboard',
    file: "routes/dashboard.tsx",
  },
];

export default routes satisfies RouteConfig;
