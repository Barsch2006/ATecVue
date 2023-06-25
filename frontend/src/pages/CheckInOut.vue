<script lang="ts">
export default {
    data() {
        return {
            rules: {
                required: (value: string) => !!value || 'Dieses Feld ist erforderlich.',
            },
            error: {
                message: "",
                show: false,
            },
            technician: {
                name: "",
                lastname: "",
                position: "",
                contact: "",
            },
            event: {
                name: "",
                description: "",
                date: "",
                time: "",
                location: ""
            },
            usage: {
                aula: false,
                stage: false,
                backstage: false,
                regie: false,
                chairs: false,
                mobile: false,
            },
            checklist: {
                doorsClosed: false,
                emergencyDoorsClosed: false,
                lightsOff: false,
                backstageLightsOff: false,
                systemOff: false,
                lockesClosed: false,
            },

            tab: 'checkIn'
        }
    },
    methods: {
        checkIn() {
            // todo
        },
        checkOut() {
            // todo
        }
    }
}
</script>

<template>
    <div>
        <v-tabs v-model="tab" fixed-tabs center-active bg-color="background" dark density="comfortable">
            <v-tab value="checkIn">CheckIn</v-tab>
            <v-tab value="checkOut">CheckOut</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item value="checkIn">
                <v-form @submit.prevent="checkIn()">
                    <v-card>
                        <v-card-title>
                            Personalien
                        </v-card-title>
                        <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                        <v-card-text>
                            <v-text-field v-model="technician.name" clearable label="Vorname" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="technician.lastname" clearable label="Nachname" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="technician.position" clearable label="Position in der Schule"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="technician.contact" clearable
                                label="E-Mail oder andere Kontaktmöglichkeit" density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Nutzung der Aula / Veranstaltung
                        </v-card-title>
                        <v-card-text>
                            <v-text-field clearable label="Kurze Bezeichnung" density="compact" :rules="[rules.required]" />
                            <v-textarea clearable label="Beschreibung" :rules="[rules.required]" />
                            <v-text-field clearable label="Datum der Veranstaltung" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field clearable label="Uhrzeit der Veranstaltung" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field clearable label="Ort der Veranstaltung" density="compact"
                                :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Erwartete Nutzung
                        </v-card-title>
                        <v-card-text>
                            <v-checkbox label="Aula" v-model="usage.aula" />
                            <v-checkbox label="Bühne" v-model="usage.stage" />
                            <v-checkbox label="Backstage" v-model="usage.backstage" />
                            <v-checkbox label="Regie" v-model="usage.regie" />
                            <v-checkbox label="Stühle" v-model="usage.chairs" />
                            <v-checkbox label="Mobile Anlage" v-model="usage.mobile" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Checkliste
                        </v-card-title>
                        <v-text>
                            Bitte unbedingt vor jeder Veranstaltung oder Nutzung der Aula durchgehen und ausfüllen!
                            <v-checkbox label="Alle Türen zur Aula waren beim Betreten geschlossen" />
                            <v-checkbox label="Notausgangstüren zur Aula waren beim Betreten geschlossen" />
                            <v-checkbox label="Lichter waren beim Betreten ausgeschaltet" />
                            <v-checkbox v-if="usage.backstage"
                                label="Lichter im Backstage waren beim Betreten ausgeschaltet" />
                            <v-checkbox v-if="usage.regie" label="Anlage war beim Betreten ausgeschaltet" />
                            <v-checkbox label="Strom für die Bühnenbeleuchtung war beim Betreten ausgeschaltet" />
                            <v-checkbox v-if="usage.backstage" label="Backstage war beim Betreten aufgeräumt" />
                            <v-checkbox v-if="usage.backstage"
                                label="Schränke im Backstage waren beim Betreten verschlossen" />
                            <v-checkbox v-if="usage.backstage"
                                label="Beide Türen zum Backstage waren beim Betreten abgeschlossen" />
                            <v-checkbox v-if="usage.regie" label="Regie war beim Betreten vollständig verschlossen" />
                            <v-checkbox v-if="usage.regie" label="Keine frei liegenden Gegenstände auf dem Regie-Tisch" />
                            <v-checkbox label="Keine frei liegenden Gegenstände auf dem Boden" />
                            <v-checkbox v-if="usage.regie"
                                label="Regie war beim Betreten aufgeräumt, Gegenstände waren an der richtigen Position" />
                            <v-checkbox label="Stühle waren beim Betreten an der rechten Wand gestapelt und/ oder im Stühlelager" />
                        </v-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Auffälligkeiten
                        </v-card-title>
                        <v-card-text>
                            <v-textarea clearable label="Auffälligkeiten" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Absenden
                        </v-card-title>
                        <v-card-text>
                            <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                            <v-btn type="submit">Absenden</v-btn>
                        </v-card-text>
                    </v-card>
                </v-form>
            </v-window-item>
            <v-window-item value="checkOut">
                <v-form @submit.prevent="checkOut()">
                    <v-card>
                        <v-card-title>
                            Personalien
                        </v-card-title>
                        <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                        <v-card-text>
                            <v-text-field v-model="technician.name" clearable label="Vorname" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="technician.lastname" clearable label="Nachname" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="technician.position" clearable label="Position in der Schule"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="technician.contact" clearable
                                label="E-Mail oder andere Kontaktmöglichkeit" density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Nutzung der Aula / Veranstaltung
                        </v-card-title>
                        <v-card-text>
                            <v-text-field clearable label="Kurze Bezeichnung" density="compact" :rules="[rules.required]" />
                            <v-textarea clearable label="Beschreibung" :rules="[rules.required]" />
                            <v-text-field clearable label="Datum der Veranstaltung" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field clearable label="Uhrzeit der Veranstaltung" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field clearable label="Ort der Veranstaltung" density="compact"
                                :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Erwartete Nutzung
                        </v-card-title>
                        <v-card-text>
                            <v-checkbox label="Aula" v-model="usage.aula" />
                            <v-checkbox label="Bühne" v-model="usage.stage" />
                            <v-checkbox label="Backstage" v-model="usage.backstage" />
                            <v-checkbox label="Regie" v-model="usage.regie" />
                            <v-checkbox label="Stühle" v-model="usage.chairs" />
                            <v-checkbox label="Mobile Anlage" v-model="usage.mobile" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Checkliste
                        </v-card-title>
                        <v-text>
                            Bitte unbedingt vor jeder Veranstaltung oder Nutzung der Aula durchgehen und ausfüllen!
                            <v-checkbox label="Alle Türen zur Aula sind geschlossen" />
                            <v-checkbox label="Notausgangstüren zur Aula sind geschlossen" />
                            <v-checkbox label="Lichter sind ausgeschaltet" />
                            <v-checkbox v-if="usage.backstage"
                                label="Lichter im Backstage sind ausgeschaltet" />
                            <v-checkbox v-if="usage.regie" label="Anlage ist ausgeschaltet" />
                            <v-checkbox label="Strom für die Bühnenbeleuchtung ist ausgeschaltet" />
                            <v-checkbox v-if="usage.backstage" label="Backstage ist aufgeräumt" />
                            <v-checkbox v-if="usage.backstage"
                                label="Schränke im Backstage sind verschlossen" />
                            <v-checkbox v-if="usage.backstage"
                                label="Beide Türen zum Backstage sind abgeschlossen" />
                            <v-checkbox v-if="usage.regie" label="Regie ist vollständig verschlossen" />
                            <v-checkbox v-if="usage.regie" label="Keine frei liegenden Gegenstände auf dem Regie-Tisch" />
                            <v-checkbox label="Keine frei liegenden Gegenstände auf dem Boden" />
                            <v-checkbox v-if="usage.regie"
                                label="Regie ist aufgeräumt, Gegenstände sind an der richtigen Position" />
                            <v-checkbox label="Stühle sind an der rechten Wand gestapelt und/ oder im Stühlelager" />
                        </v-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Auffälligkeiten
                        </v-card-title>
                        <v-card-text>
                            <v-textarea clearable label="Auffälligkeiten" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Absenden
                        </v-card-title>
                        <v-card-text>
                            <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                            <v-btn type="submit">Absenden</v-btn>
                        </v-card-text>
                    </v-card>
                </v-form>
            </v-window-item>
        </v-window>
    </div>
</template>

<style scoped>
.v-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    padding: 20px;
}

.v-card {
    width: 80%;
}
</style>
