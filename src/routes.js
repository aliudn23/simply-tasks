import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/Login.vue';

// Define the routes for the task section
import TaskList from './pages/TaskList.vue';
import TaskDetails from './pages/TaskDetails.vue';

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
    },
    {
        path: '/tasks/:id',
        name: 'TaskDetails',
        component: TaskDetails
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
