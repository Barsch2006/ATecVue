<script lang="ts">
export default {
    data() {
        return {
            rules: {
                required: (value: string) => !!value || 'Dieses Feld ist erforderlich.',
                email: (value: string) => {
                    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                    return pattern.test(value) || 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
                },
            },
        };
    },
};
</script>


<template>
    <v-form action="/login" method="post">
        <v-card>
            <v-card-title>
                Login
            </v-card-title>
            <v-card-text>
                <v-text-field name="email" type="email" clearable label="E-Mail" density="compact"
                    :rules="[rules.required, rules.email]" />
                <v-text-field name="password" type="password" clearable label="Passwort" density="compact"
                    :rules="[rules.required]" />
            </v-card-text>
            <v-card-actions>
                <v-btn type="submit" variant="outlined" width="100%">Login</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<style scoped>
.v-card-title {
    font-size: 1.5rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.v-form {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    flex-direction: column;
    height: 100%;
    padding-top: 40px;
    gap: 20px;
}

.v-card {
    width: 600px;
}

@media screen and (max-width: 900px) {
    .v-card {
        width: 80%;
    }
}
</style>
