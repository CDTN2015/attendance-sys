import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    redirect: "/login",
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView"),
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/UserView"),
    redirect: "/personal",
    children: [
      {
        path: "/personal",
        name: "personal",
        component: () => import("../views/PersonalView"),
      },
      {
        path: "/employees",
        name: "employees",
        component: () => import("../views/EmployeesView"),
      },
      {
        path: "/backend",
        name: "backend",
        component: () => import("../views/BackEndView"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
