<template>
    <div class="task-details" v-if="task">
        <h1>{{ task.title }}</h1>
        <p><strong>Description:</strong> {{ task.description }}</p>
        <p><strong>Status:</strong> {{ task.status }}</p>
        <p><strong>Due Date:</strong> {{ formatDate(task.dueDate) }}</p>
    </div>
    <div v-else>
        <p>Loading task details...</p>
    </div>
</template>

<script>
export default {
    name: 'TaskDetails',
    data() {
        return {
            task: null,
        };
    },
    created() {
        this.fetchTask();
    },
    methods: {
        fetchTask() {
            // Replace with actual API call or Vuex store access
            // Example static data for demonstration
            this.task = {
                id: 1,
                title: 'Sample Task',
                description: 'This is a sample task description.',
                status: 'In Progress',
                dueDate: '2024-07-01',
            };
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateStr).toLocaleDateString(undefined, options);
        },
    },
};
</script>

<style scoped>
.task-details {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.task-details h1 {
    margin-bottom: 1rem;
}
.task-details p {
    margin: 0.5rem 0;
}
</style>