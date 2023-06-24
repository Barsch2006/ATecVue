<script lang="ts">
export default {
    data() {
        return {
            rules: {
                required: (value: string) => !!value || 'Dieses Feld ist erforderlich.'
            },
        };
    },
};
</script>


<template>
    <div class="login-wrapper">
        <v-form id="loginform" action="/login" method="post">
            <img class="logo" src="/Atec_small.jpg" alt="Dolphin School" />
            <h1>Login</h1>
            <v-text-field name="username" clearable label="Benutzername" density="compact"
                :rules="[rules.required]" />
            <v-text-field name="password" type="password" clearable label="Passwort" density="compact"
                :rules="[rules.required]" />
            <v-btn type="submit" variant="tonal" width="100%">Login</v-btn>
        </v-form>
    </div>
</template>

<style scoped>
@import url("../assets/login.css");
</style>
