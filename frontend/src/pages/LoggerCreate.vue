<script lang="ts">
export default {
    data() {
        return {
            rules: {
                required: (value: string) => !!value || 'Dieses Feld ist erforderlich.'
            },
            date: '',
            time: '',
            name: '',
            type: '',
            text: '',
            error: {
                show: false,
                message: ''
            }
        };
    },
    methods: {
        submitLogger() {
            fetch('/logs', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: this.date,
                    time: this.time,
                    name: this.name,
                    type: this.type,
                    text: this.text
                })
            }).then((response) => {
                if (response.status != 200) {
                    this.error.show = true;
                    this.error.message = response.statusText;
                } else {
                    this.$router.push('/logger');
                }
            });
        }
    }
}
</script>

<template>
    <v-form @submit.prevent="submitLogger()">
        <v-card>
            <v-card-title>
                Angaben über die Person
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="name" clearable label="Name" density="compact" :rules="[rules.required]" />
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>
                Zeitpunkt
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="date" clearable label="Datum" density="compact" :rules="[rules.required]"
                    type="date" />
                <v-text-field v-model="time" clearable label="Uhrzeit" density="compact" :rules="[rules.required]"
                    type="time" />
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>
                Logging-Type
            </v-card-title>
            <v-card-text>
                <v-select v-model="type" clearable label="Typ des Loggings" density="compact" :rules="[rules.required]"
                    :items="[
                        'Nutzung',
                        'Misstand',
                        'Sonstiges'
                    ]" />
                <v-textarea v-model="text" clearable label="Beschreibung/ etc." :rules="[rules.required]"></v-textarea>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>
                Senden
            </v-card-title>
            <v-card-text>
                <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                <v-btn type="submit">
                    Senden
                </v-btn>
            </v-card-text>
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
