import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/Login.vue';

// Define the routes for the task section
import TaskList from './pages/TaskList.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/tasks',
        name: 'TaskList',
        component: TaskList
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
