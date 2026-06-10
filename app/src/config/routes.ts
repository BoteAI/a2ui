import { type IRouteProps } from 'umi';

const routers: IRouteProps[] = [
  {
    exact: true,
    path: '/',
    redirect: '/a2ui-playgroup/v9',
  },
  {
    exact: true,
    path: '/a2ui-playgroup/v8',
    component: './a2ui-playgroup/v8',
  },
  {
    exact: true,
    path: '/a2ui-playgroup/v9/custom-components',
    component: './a2ui-playgroup/v9/customComponentsGuide',
  },
  {
    exact: true,
    path: '/a2ui-playgroup/v9',
    component: './a2ui-playgroup/v9',
  },
];

export default routers;
