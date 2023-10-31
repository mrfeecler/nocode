// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Login",
        component: () => import("@/views/Login.vue"),
      },
      {
        path: "/forgot",
        name: "Forgot",
        component: () => import("@/views/Forgot.vue"),
      },
      {
        path: "/list",
        name: "List",
        component: () => import("@/views/List.vue"),
      },
      {
        path: "/form",
        name: "Business form",
        component: () => import("@/views/form/BusinessForm.vue"),
      },
      {
        path: "/form/:formID",
        name: "Business form Detail",
        component: () => import("@/views/form/BusinessFormDetail.vue"),
      },
      {
        path: "/info-user",
        name: "UpdateUser",
        component: () => import("@/views/users/UserDetail.vue"),
      },
      {
        path: "/users",
        name: "Users",
        component: () => import("@/views/users/Users.vue"),
      },
      {
        path: "/user/:userID",
        name: "User",
        component: () => import("@/views/users/User.vue"),
      },
      {
        path: "/user/update/:userID",
        name: "User Update",
        component: () => import("@/views/users/UpdateUser.vue"),
      },
      {
        path: "/user/register",
        name: "User Create",
        component: () => import("@/views/users/AddUser.vue"),
      },
      {
        path: "/vehicles",
        name: "Vehicles",
        component: () => import("@/views/vehicle/Vehicles.vue"),
      },
      {
        path: "/vehicle/register",
        name: "AddVehicle",
        component: () => import("@/views/vehicle/addVehicle.vue"),
      },
      {
        path: "/vehicle/:vehicleID",
        name: "Vehicle",
        component: () => import("@/views/vehicle/Vehicle.vue"),
      },
      {
        path: "/vehicle/update/:vehicleID",
        name: "Vehicle Update",
        component: () => import("@/views/vehicle/UpdateVehicle.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
