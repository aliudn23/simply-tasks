<template>
    <div class="card">
        <div class="card-body">
            <form @submit.prevent="handleLogin">
                <h2>Login</h2>
                <hr>
                <div class="form-group text-start mb-3">
                    <label for="email">Email</label>
                    <input
                        class="form-control"
                        id="email"
                        v-model="email"
                        type="email"
                        required
                        autocomplete="username"
                    />
                </div>
                <div class="form-group text-start mb-3">
                    <label for="password">Password</label>
                    <input
                        class="form-control"
                        id="password"
                        v-model="password"
                        type="password"
                        required
                        autocomplete="current-password"
                    />
                </div>
                <button class="btn btn-primary btn-block" type="submit">Login</button>
                <p v-if="error" class="error">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            email: "user@example.com",
            password: "password",
            error: ""
        };
    },
    methods: {
        handleLogin() {
            this.error = "";
            // Replace with real authentication logic
            fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
                },
                body: JSON.stringify({
                    username: this.email,
                    password: this.password
                })
            })
            .then(response => response.json())
            .then(data => {
                // handle response if needed
                if (data.success) {
                    alert(data.message || "Login successful!");

                    // Save token to localStorage
                    if (data.token) {
                        localStorage.setItem('authToken', data.token);

                        // redirect to home or another page
                        this.$router.push({ name: 'TaskList' });
                    }
                } else {
                    this.error = data.message || "Invalid email or password.";
                }
            })
            .catch(() => {
                this.error = "Failed to connect to server.";
            });
        }
    }
};
</script>

<style scoped>
.error {
    color: #d9534f;
    margin-top: 1rem;
    text-align: center;
}
</style>