<script lang="ts">
export default {
    data() {
        return {
            rules: {
                required: (value: string) => !!value || 'Dieses Feld ist erforderlich.'
            },
            username: "",
            password: "",
            button: {
                loading: false,
                disabled: false
            },
            error: {
                show: false,
                message: ""
            }
        };
    },
    methods: {
        async login() {
            // disable login button to prevent spamming
            // show loading indicator
            // clear error message

            this.button.disabled = true;
            this.button.loading = true;

            // post request to https://debug-137.heeecker.me/login
            // with username and password as json
            // if successful, redirect to /home
            // else show error message
            const result = await fetch("https://debug-137.heeecker.me/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            }).catch(() => {
                this.button.disabled = false;
                this.button.loading = false;
                this.error.message = "Verbindung zum Server ist fehlgeschlagen!"
                this.error.show = true;
            })

            if (!result) return;

            if (result.status !== 200) {
                this.button.disabled = false;
                this.button.loading = false;
                this.error.message = "Login fehlgeschlagen!"
                this.error.show = true;
            } else {
                this.$router.push("/home");
            }
        }
    }
};
</script>


<template>
    <div class="login-wrapper">
        <v-form id="loginform" @submit.prevent="login()">
            <img class="logo" src="/Atec_small.jpg" alt="Dolphin School" />
            <h1>Login</h1>
            <v-card color="error">
                {{ error.message }}
            </v-card>
            <v-text-field v-model="username" clearable label="Benutzername" density="compact" :rules="[rules.required]"
                name="username" />
            <v-text-field v-model="password" type="password" clearable label="Passwort" density="compact"
                :rules="[rules.required]" name="password" />
            <v-btn type="submit" variant="tonal" width="100%" :disabled="button.disabled"
                :loading="button.loading">Login</v-btn>
        </v-form>
    </div>
</template>

<style scoped>
@import url("../assets/login.css");
</style>
