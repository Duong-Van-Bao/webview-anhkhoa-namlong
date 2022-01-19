import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("./views/app"),
    redirect: "/admin/dashboards",
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "admin/dashboards",
        component: () =>
          import("./views/app/dashboards/Default")
      },
      {
        path: "admin/map",
        component: () =>
          import("./views/map/Maps"),
      },
      {
        path: "admin/forecast",
        component: () =>
          import("./views/forecast/Forecast"),
      },
      {
        path: "admin/config",
        component: () =>
          import("./views/app/config"),
        redirect: "/admin/config/manager-menu",
        children: [
          {
            path: "menu-systems",
            component: () =>
              import("./views/app/config/system/Menu")
          },
          {
            path: "data-type",
            component: () =>
              import("./views/app/config/system/DataType")
          },
          {
            path: "level-warning",
            component: () =>
              import("./views/app/config/warning/LevelWarning")
          },
          {
            path: "indicator-warning",
            component: () =>
              import("./views/app/config/warning/IndicatorWarning")
          },
        ]
      },
      {
        path: "admin/security",
        component: () =>
          import("./views/app/security"),
        redirect: "/admin/security/group-users",
        children: [
          {
            path: "menu-permission",
            component: () =>
              import("./views/app/security/manager/MenuRight")
          },
          {
            path: "group-users",
            component: () =>
              import("./views/app/security/manager/Group")
          },
          {
            path: "users",
            component: () =>
              import("./views/app/security/manager/User")
          },
          {
            path: "group-employers",
            component: () =>
              import("./views/app/security/manager/GroupEmployer")
          },
          {
            path: "employers",
            component: () =>
              import("./views/app/security/manager/Employer")
          },
        ]
      },
      {
        path: "admin/category",
        component: () =>
          import("./views/app/category"),
        redirect: "/admin/category/collect-type",
        children: [
          {
            path: "collect-type",
            component: () =>
              import("./views/app/category/CollectType")
          },
          {
            path: "power-type",
            component: () =>
              import("./views/app/category/PowerType")
          },
          {
            path: "connect-type",
            component: () =>
              import("./views/app/category/ConnectType")
          },
          {
            path: "stations",
            component: () =>
              import("./views/app/category/Stations")
          },
          {
            path: "tree-color",
            component: () =>
              import("./views/app/category/tree/Color")
          },
          {
            path: "tree-land",
            component: () =>
              import("./views/app/category/tree/Land")
          },
          {
            path: "tree-leaf",
            component: () =>
              import("./views/app/category/tree/Leaf")
          },
          {
            path: "tree",
            component: () =>
              import("./views/app/category/tree/Tree")
          },
          {
            path: "tree-group",
            component: () =>
              import("./views/app/category/tree/TreeGroup")
          },
          {
            path: "tree-status",
            component: () =>
              import("./views/app/category/tree/TreeStatus")
          },
          {
            path: "tree-type",
            component: () =>
              import("./views/app/category/tree/TreeType")
          },
          {
            path: "tree-category",
            component: () =>
              import("./views/app/category/tree/TreeCategory")
          },
          {
            path: "tree-crown",
            component: () =>
              import("./views/app/category/tree/Crown")
          },
          {
            path: "tree-route",
            component: () =>
              import("./views/app/category/tree/TreeRoute")
          },
          {
            path: "monitor-indicator",
            component: () =>
              import("./views/app/category/monitor/Indicators")
          },
          {
            path: "monitor-device",
            component: () =>
              import("./views/app/category/monitor/Devices")
          },
        ]
      },
      {
        path: "admin/function",
        component: () =>
          import("./views/app/function"),
        redirect: "/admin/function/collect-data",
        children: [
          {
            path: "collect-data",
            component: () =>
              import("./views/app/function/CollectData")
          },
          {
            path: "environment-monitor",
            component: () =>
              import("./views/app/function/Enviroment")
          },
        ]
      },
    ]
  },
  {
    path: "/user",
    component: () => import("./views/user"),
    redirect: "/user/login",
    meta: {
      dashboardOut: true
    },
    children: [
      {
        path: "login",
        component: () =>
          import("./views/user/Login")
      },
      {
        path: "register",
        component: () =>
          import("./views/user/Register")
      },
      {
        path: "forgot-password",
        component: () =>
          import("./views/user/ForgotPassword")
      },
      {
        path: "reset-password",
        component: () =>
          import("./views/user/ResetPassword")
      },

    ]
  },
  {
    path: "*",
    component: () => import("./views/Error")
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.currentUser != null) {
      next()
      return
    }
    next('/user/login')
  }
  next()
})

export default router;
