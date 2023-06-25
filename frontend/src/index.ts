import { createApp } from "vue";
import Index from "./Index.vue";

import Homepage from "./pages/Homepage.vue";
import EventForm from "./pages/EventForm.vue";
import Login from "./pages/Login.vue";
import Admin from "./pages/Admin.vue";
import Technician from "./pages/Technician.vue";
import ATecRules from "./pages/ATecRules.vue";
import IssueCreate from "./pages/IssueCreate.vue";
import LoggerView from "./pages/LoggerView.vue";
import Datenschutz from "./pages/Datenschutz.vue";
import Impressum from "./pages/Impressum.vue";
import CheckInOut from "./pages/CheckInOut.vue";

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
        path: "/rules",
        name: "Regeln",
        component: ATecRules
    },
    {
        path: "/logger/create",
        name: "IssueCreate",
        component: IssueCreate
    },
    {
        path: "/logger",
        name: "LoggerView",
        component: LoggerView
    },
    {
        path: "/datenschutz",
        name: "Datenschutz",
        component: Datenschutz
    },
    {
        path: "/impressum",
        name: "Impressum",
        component: Impressum
    },
    // {
    //     path: "/checkin",
    //     name: "Checkin",
    //     component: CheckInOut
    // },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(Index)
    .use(router)
    .use(vuetify)
    .mount("#app");
