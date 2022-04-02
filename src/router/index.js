import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    redirect: "/login",
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
