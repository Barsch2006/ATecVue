<script lang="ts">
export default {
    data() {
        return {
            rules: {
                required: (value: string) => !!value || 'Dieses Feld ist erforderlich.',
                email: (value: string) => {
                    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                    return pattern.test(value) || 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
                }
            },
            microphones: 0,
            headsets: 0
        }
    }
}
</script>

<template>
    <v-form action="/event" method="post">
        <v-card>
            <v-card-title>
                Angaben über den Veranstalter
            </v-card-title>
            <v-card-text>
                <v-text-field name="name" clearable label="Vorname" density="compact" :rules="[rules.required]" />
                <v-text-field name="lastname" clearable label="Nachname" density="compact" :rules="[rules.required]" />
                <v-text-field name="position" clearable label="Position in der Schule" density="compact"
                    :rules="[rules.required]" />
                <v-text-field name="email" type="email" clearable label="E-Mail" density="compact"
                    :rules="[rules.required, rules.email]" />
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                Veranstaltung
            </v-card-title>
            <v-card-text>
                <v-text-field name="title" clearable label="Titel der Veranstaltung" density="compact"
                    :rules="[rules.required]" />
                <v-textarea name="description" clearable label="Beschreibung" :rules="[rules.required]" />
                <v-text-field name="targetgroup" clearable label="Zielgruppe" density="compact" :rules="[rules.required]" />
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                Zeitpunkt
            </v-card-title>
            <v-card-text>
                <v-text-field name="date" clearable label="Datum" density="compact" :rules="[rules.required]"
                    type="date" />
                <v-text-field name="start" clearable label="Start" density="compact" :rules="[rules.required]"
                    type="time" />
                <v-text-field name="end" clearable label="Vorraussichtliches Ende" density="compact"
                    :rules="[rules.required]" type="time" />
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                Veranstaltungsort
            </v-card-title>
            <v-card-text>
                <v-select name="location" :items="['Aula', 'Sporthalle', 'Sportplatz']" :rules="[rules.required]"
                    clearable label="Veranstaltungsort" density="compact" />
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                Materialien
            </v-card-title>
            <v-card-text>
                <v-slider name="microphones" v-model="microphones" :label="`Handmikrofone (${microphones})`" :max="10" :min="0" :step="1"
                    ticks="1" />
                <v-slider name="headsets" v-model="headsets" :label="`Headsets (${headsets})`" :max="10" :min="0" :step="1" ticks="1" />
                <v-checkbox name="beamer" label="Beamer"></v-checkbox>
                <v-checkbox name="hdmi" label="Mein Laptop hat einen HDMI Anschluss"></v-checkbox>
                <v-checkbox name="vga" label="Mein Laptop hat einen VGA Anschluss"></v-checkbox>
                <v-checkbox name="usb" label="Ich habe einen USB-Stick oder in der Cloud"></v-checkbox>
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                Schluss
            </v-card-title>
            <v-card-text>
                <v-textarea name="notes" clearable label="Sonstiges, Anmerkungen, Generalprobe.." />
            </v-card-text>
            <v-card-actions>
                <v-btn type="submit" variant="tonal" width="100%">Absenden</v-btn>
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
}</style>
