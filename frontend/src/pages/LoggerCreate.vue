<script lang="ts">
export default {
    data() {
        return {
            rules: {
                required: (value: string) => !!value || 'Dieses Feld ist erforderlich.'
            }
        };
    }
}
</script>

<template>
    <v-form>
        <v-card>
            
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
