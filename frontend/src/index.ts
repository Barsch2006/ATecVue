import { createApp } from "vue";
import Index from "./Index.vue";

import Homepage from "./pages/Homepage.vue";
import EventForm from "./pages/EventForm.vue";
import Login from "./pages/Login.vue";
import Admin from "./pages/Admin.vue";
import Technician from "./pages/Technician.vue";
import About from "./pages/About.vue";
import ATecRules from "./pages/ATecRules.vue";

import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css";
import "./assets/base.css";

import { createRouter, createWebHistory } from "vue-router";

import vuetify from "./plugins/vuetify";

const routes = [
    {
        path: "/",
        name: "Login",
        component: Login
    },
    {
        path: "/home",
        name: "Startseite",
        component: Homepage
    },
    {
        path: "/createevent",
        name: "EventForm",
        component: EventForm
    },
    {
        path: "/admin",
        name: "Admin",
        component: Admin
    },
    {
        path: "/technician",
        name: "Technician",
        component: Technician
    },
    {
        path: "/about",
        name: "About",
        component: About
    },
    {
        path: "/rules",
        name: "Regeln",
        component: ATecRules
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(Index)
    .use(router)
    .use(vuetify)
    .mount("#app");
