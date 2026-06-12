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
    path: '/a2ui-playgroup/v9/custom-components-guide',
    component: './a2ui-playgroup/v9/customComponentsGuideDoc',
  },
  {
    exact: true,
    path: '/a2ui-playgroup/v9/custom-components',
    redirect: '/a2ui-playgroup/v9/custom-components-guide',
  },
  {
    exact: true,
    path: '/a2ui-playgroup/v9',
    component: './a2ui-playgroup/v9',
  },
  {
    exact: true,
    path: '/a2ui-preset-catalog',
    component: './a2ui-preset-catalog',
  },
];

export default routers;
