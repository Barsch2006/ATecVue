import { createApp } from "vue";
import Index from "./Index.vue";

import Homepage from "./pages/Homepage.vue";
import EventForm from "./pages/EventForm.vue";
import Login from "./pages/Login.vue";
import Admin from "./pages/UserDashboard.vue";

import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css";
import "./assets/base.css";

import { createRouter, createWebHistory } from "vue-router";

import vuetify from "./plugins/vuetify";

const routes = [
    {
        path: "/",
        name: "Startseite",
        component: Homepage
    },
    {
        path: "/createevent",
        name: "EventForm",
        component: EventForm
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/admin",
        name: "Admin",
        component: Admin
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(Index)
    .use(router)
    .use(vuetify)
    .mount("#app");
