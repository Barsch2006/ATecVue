<script lang="ts">
export default {
    data() {
        return {
            rules: {
                required: (value: string) => !!value || 'Dieses Feld ist erforderlich.'
            },
            date: '',
            start: '',
            end: ''
        };
    }
}
</script>

<template>
    <v-form>
        <v-card>
            <v-card-title>
                Zeitpunkt
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="date" clearable label="Datum" density="compact" :rules="[rules.required]"
                    type="date" />
                <v-text-field v-model="start" clearable label="Start" density="compact" :rules="[rules.required]"
                    type="time" />
                <v-text-field v-model="end" clearable label="Vorraussichtliches Ende" density="compact"
                    :rules="[rules.required]" type="time" />
            </v-card-text>
        </v-card>
        <!--  more info -->
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
