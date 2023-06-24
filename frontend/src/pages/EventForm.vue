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
            headsets: 0,
            name: '',
            lastname: '',
            position: '',
            email: '',
            title: '',
            description: '',
            targetgroup: '',
            date: '',
            start: '',
            end: '',
            location: '',
            notes: '',
            beamer: false,
            hdmi: false,
            vga: false,
            usb: false,
            error: {
                show: false,
                message: ""
            }
        }
    },
    methods: {
        async sendData() {
            const data = {
                microphones: this.microphones,
                headsets: this.headsets,
                name: this.name,
                lastname: this.lastname,
                position: this.position,
                email: this.email,
                title: this.title,
                description: this.description,
                targetgroup: this.targetgroup,
                start: new Date(`${this.date} ${this.start}`).getTime()/1000,
                end: new Date(`${this.date} ${this.end}`).getTime()/1000,
                location: this.location,
                notes: this.notes,
                beamer: this.beamer,
                hdmi: this.hdmi,
                vga: this.vga,
                usb: this.usb
            }

            const result = await fetch("https://debug-137.heeecker.me/event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).catch(() => {
                this.error.message = "Verbindung zum Server ist fehlgeschlagen!"
                this.error.show = true;
            })

            if (!result) return;

            if (result.status !== 200) {
                this.error.message = "Hochladen fehlgeschlagen!"
                this.error.show = true;
            } else {
                this.$router.push("/home");
            }
        }
    }
}
</script>

<template>
    <v-form @submit.prevent="sendData()">
        <v-card>
            <v-card-title>
                Angaben über den Veranstalter
            </v-card-title>
            <v-card color="error">
                {{ error.message }}
            </v-card>
            <v-card-text>
                <v-text-field v-model="name" clearable label="Vorname" density="compact" :rules="[rules.required]" />
                <v-text-field v-model="lastname" clearable label="Nachname" density="compact" :rules="[rules.required]" />
                <v-text-field v-model="position" clearable label="Position in der Schule" density="compact"
                    :rules="[rules.required]" />
                <v-text-field v-model="email" type="email" clearable label="E-Mail" density="compact"
                    :rules="[rules.required, rules.email]" />
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                Veranstaltung
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="title" clearable label="Titel der Veranstaltung" density="compact"
                    :rules="[rules.required]" />
                <v-textarea name="description" clearable label="Beschreibung" :rules="[rules.required]" />
                <v-text-field v-model="targetgroup" clearable label="Zielgruppe" density="compact"
                    :rules="[rules.required]" />
            </v-card-text>
        </v-card>

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

        <v-card>
            <v-card-title>
                Veranstaltungsort
            </v-card-title>
            <v-card-text>
                <v-select v-model="location" :items="['Aula', 'Sporthalle', 'Sportplatz']" :rules="[rules.required]"
                    clearable label="Veranstaltungsort" density="compact" />
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                Materialien
            </v-card-title>
            <v-card-text>
                <v-slider v-model="microphones" :label="`Handmikrofone (${microphones})`" :max="10" :min="0" :step="1"
                    ticks="1" />
                <v-slider v-model="headsets" :label="`Headsets (${headsets})`" :max="10" :min="0" :step="1" ticks="1" />
                <v-checkbox v-model="beamer" label="Beamer"></v-checkbox>
                <v-checkbox :disabled="!beamer" v-model="hdmi" label="Mein Laptop hat einen HDMI Anschluss"></v-checkbox>
                <v-checkbox :disabled="!beamer" v-model="vga" label="Mein Laptop hat einen VGA Anschluss"></v-checkbox>
                <v-checkbox :disabled="!beamer" v-model="usb"
                    label="Ich habe einen USB-Stick oder in der Cloud"></v-checkbox>
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
