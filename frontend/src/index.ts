import { createApp } from "vue";
import Index from "./Index.vue";

import Homepage from "./pages/Homepage.vue";
import EventForm from "./pages/EventForm.vue";
import Login from "./pages/Login.vue";
import Admin from "./pages/Admin.vue";
import Technician from "./pages/Technician.vue";
import ATecRules from "./pages/ATecRules.vue";
import TakeItems from "./pages/TakeItems.vue";
import LoggerView from "./pages/LoggerView.vue";
import Datenschutz from "./pages/Datenschutz.vue";
import Impressum from "./pages/Impressum.vue";
import ChPwd from "./pages/ChPwd.vue";
import Wishlist from "./pages/Wishlist.vue";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import "./assets/base.css";

import { createRouter, createWebHistory } from "vue-router";

import vuetify from "./plugins/vuetify";
import MyEvents from "./pages/MyEvents.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Startseite",
    component: Homepage,
  },
  {
    path: "/createevent",
    name: "EventForm",
    component: EventForm,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/technician",
    name: "Technician",
    component: Technician,
  },
  {
    path: "/rules",
    name: "Regeln",
    component: ATecRules,
  },
  {
    path: "/logger",
    name: "LoggerView",
    component: LoggerView,
  },
  {
    path: "/datenschutz",
    name: "Datenschutz",
    component: Datenschutz,
  },
  {
    path: "/impressum",
    name: "Impressum",
    component: Impressum,
  },
  {
    path: "/chpwd",
    name: "ChangePassword",
    component: ChPwd,
  },
  {
    path: "/takeitems",
    name: "TakeItems",
    component: TakeItems,
  },
  {
    path: "/myevents",
    name: "MyEvents",
    component: MyEvents,
  },
  {
    path: "/wishlist",
    name: "Wishlist",
    component: Wishlist,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(Index).use(router).use(vuetify).mount("#app");
