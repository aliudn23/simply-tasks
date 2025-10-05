<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Task List</h2>
            <div>
                <button class="btn btn-primary" @click="openModal('add')">+ Add Task</button>
                <button class="btn btn-primary mx-2" @click="logout()">Logout</button>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-4">
                <input
                    v-model="search"
                    type="text"
                    class="form-control"
                    placeholder="Search by title..."
                />
            </div>
            <div class="col-md-4">
                <select v-model="filterStatus" class="form-control">
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
        </div>

        <!-- Mobile Table -->
        <div class="d-block d-md-none col-12 mb-3">
            <div v-for="(task, idx) in paginatedTasks" :key="task.id" class="card mb-2">
            <div class="card-body p-2">
                <div class="d-flex justify-content-between align-items-center">
                    <strong>{{ task.title }}</strong>
                    <span :class="statusClass(task.status)">{{ task.status }}</span>
                </div>
                <hr>
                <div class="text-muted mb-2" style="font-size: 0.95em;">
                    {{ task.description }}
                </div>
                <hr>
                <div>
                    <button class="btn btn-sm btn-info mr-2" @click="openModal('edit', task)">Edit</button>
                    <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">Delete</button>
                </div>
            </div>
            </div>
            <div v-if="paginatedTasks.length === 0" class="text-center text-muted">
            No tasks found.
            </div>
        </div>
        <!-- End Mobile Table -->

        <!-- Desktop Table -->
        <table class="d-none d-lg-block table table-bordered table-hover">
            <thead class="thead-light">
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th style="width: 160px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(task, idx) in paginatedTasks" :key="task.id">
                    <td>{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
                    <td>{{ task.title }}</td>
                    <td>{{ task.description }}</td>
                    <td>
                        <span :class="statusClass(task.status)">{{ task.status }}</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-info mr-2" @click="openModal('edit', task)">Edit</button>
                        <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">Delete</button>
                    </td>
                </tr>
                <tr v-if="paginatedTasks.length === 0">
                    <td colspan="5" class="text-center">No tasks found.</td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <nav>
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                </li>
                <li
                    class="page-item"
                    v-for="page in totalPages"
                    :key="page"
                    :class="{ active: currentPage === page }"
                >
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                </li>
            </ul>
        </nav>

        <!-- Modal -->
        <div
            class="modal fade"
            id="taskModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="taskModalLabel"
            aria-hidden="true"
            ref="taskModal"
        >
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form @submit.prevent="saveTask">
                        <div class="modal-header">
                            <h5 class="modal-title" id="taskModalLabel">
                                {{ modalMode === 'add' ? 'Add Task' : 'Edit Task' }}
                            </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group mb-3">
                                <label class="mb-2">Title</label>
                                <input v-model="modalTask.title" type="text" class="form-control" required />
                            </div>
                            <div class="form-group mb-3">
                                <label class="mb-2">Description</label>
                                <textarea v-model="modalTask.description" class="form-control" required></textarea>
                            </div>
                            <div class="form-group mb-3">
                                <label class="mb-2">Status</label>
                                <select v-model="modalTask.status" class="form-control" required>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal">Cancel</button>
                            <button type="submit" class="btn btn-primary">{{ modalMode === 'add' ? 'Add' : 'Update' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TaskList",
    data() {
        return {
            tasks: [],
            search: "",
            filterStatus: "",
            currentPage: 1,
            pageSize: 10,
            modalMode: "add",
            modalTask: { id: null, title: "", description: "", status: "Pending" },
            totalTasks: 0,
            sortBy: "id",
            order: "desc",
            isLoading: false,
        };
    },
    mounted() {
        this.fetchTasks();
    },
    computed: {
        filteredTasks() {
            // Filtering is now handled server-side, so just return tasks
            return this.tasks;
        },
        totalPages() {
            return Math.ceil(this.totalTasks / this.pageSize) || 1;
        },
        paginatedTasks() {
            // Pagination is handled server-side, so just return tasks
            return this.filteredTasks;
        }
    },
    watch: {
        search: {
            handler() {
                this.currentPage = 1;
                this.fetchTasks();
            },
            immediate: false,
        },
        filterStatus: {
            handler() {
                this.currentPage = 1;
                this.fetchTasks();
            },
            immediate: false,
        },
        currentPage() {
            this.fetchTasks();
        },
        pageSize() {
            this.currentPage = 1;
            this.fetchTasks();
        }
    },
    methods: {
        async fetchTasks() {
            this.isLoading = true;
            const params = new URLSearchParams({
                limit: this.pageSize,
                page: this.currentPage,
                sortBy: this.sortBy,
                order: this.order,
            });
            if (this.search) params.append("search", this.search);
            if (this.filterStatus) params.append("status", this.filterStatus);

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks?${params}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success === false) {
                    localStorage.removeItem('authToken');
                    window.location.href = "/";
                    return;
                }
                this.tasks = data.tasks || [];
                this.totalTasks = data.meta?.total || this.tasks.length;
            } catch (e) {
                this.tasks = [];
                this.totalTasks = 0;
            } finally {
                this.isLoading = false;
            }
        },
        statusClass(status) {
            switch (status) {
                case "Completed":
                    return "text text-success";
                case "In Progress":
                    return "text text-warning";
                default:
                    return "text text-secondary";
            }
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
        openModal(mode, task = null) {
            this.modalMode = mode;

            if (mode === "edit" && task) {
                this.modalTask = { ...task };
            } else {
                this.modalTask = { id: null, title: "", description: "", status: "Pending" };
            }
            this.$refs.taskModal.style.display = "block";
            document.body.classList.add("modal-open");
            this.$refs.taskModal.classList.add("fade");
            setTimeout(() => {
                this.$refs.taskModal.classList.add("show");
            }, 10);
        },
        closeModal() {
            this.$refs.taskModal.style.display = "none";
            document.body.classList.remove("modal-open");
            this.$refs.taskModal.classList.remove("fade");
        },
        logout() {
            localStorage.removeItem('authToken');
            window.location.href = "/";
        },
        async saveTask() {
            const token = localStorage.getItem('authToken');
            if (this.modalMode === "add") {
                // POST to API
                try {
                    await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(this.modalTask),
                    });
                    this.fetchTasks();
                } catch (e) {}
            } else if (this.modalMode === "edit") {
                // PUT to API
                try {
                    await fetch(`${import.meta.env.VITE_API_URL}/tasks/${this.modalTask.id}`, {
                        method: "PUT",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(this.modalTask),
                    });
                    this.fetchTasks();
                } catch (e) {}
            }
            this.closeModal();
        },
        async deleteTask(id) {
            const token = localStorage.getItem('authToken');
            if (confirm("Are you sure you want to delete this task?")) {
                try {
                    await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    this.fetchTasks();
                } catch (e) {}
            }
        },
    },
};
</script>
