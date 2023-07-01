<script lang="ts">
interface ILog {
    type: "CheckIn" | "CheckOut",
    technician: {
        name: "",
        position: "",
        contact: "",
    },
    eventinfo: {
        name: "",
        description: "",
        date: "",
        time: "",
        location: "",
        url: ""
    },
    usage: {
        // anlage
        regie: false,
        mobile: false,
        // bühne
        stage: false,
        backstage: false,
        // stühle und tische
        chairs: false,
        tables: false,
        elements: false
    },
    checklist: {
        doorsClosed: false,
        emergencyDoorsClosed: false,
        regieClosed: false,
        lightsOff: false,
        beamerOff: false,
        clear: false,
        regie: false,
        powerOn: false,
        powerOff: false,
        stage: false,
        backstage: false,
        chairs: false,
        tables: false,
    },
    issues: "",
}

export default {
    data() {
        return {
            expand: [
                'Aula',
                'Regie',
                'Bühne',
                'Tische und Stühle'
            ],
            rules: {
                required: (value: string) => !!value || 'Dieses Feld ist erforderlich.',
            },
            error: {
                message: "",
                show: false,
            },
            tab: 'CheckIn',
            log: {
                type: "",
                technician: {
                    name: "",
                    position: "",
                    contact: "",
                },
                eventinfo: {
                    name: "",
                    description: "",
                    date: "",
                    time: "",
                    location: "",
                    url: ""
                },
                usage: {
                    // anlage
                    regie: false,
                    mobile: false,
                    // bühne
                    stage: false,
                    backstage: false,
                    // stühle und tische
                    chairs: false,
                    tables: false,
                    elements: false
                },
                checklist: {
                    doorsClosed: false,
                    emergencyDoorsClosed: false,
                    regieClosed: false,
                    lightsOff: false,
                    beamerOff: false,
                    clear: false,
                    regie: false,
                    powerOn: false,
                    powerOff: false,
                    stage: false,
                    backstage: false,
                    chairs: false,
                    tables: false,
                },
                issues: "",
            }
        }
    },
    methods: {
        checkIn() {
            // post log data to backend
            this.log.type = "CheckIn"
            fetch('/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.log)
            }).then((response) => {
                if (response.status === 200) {
                    this.$router.push('/logger')
                } else {
                    this.error.message = "Fehler beim Absenden des Logs"
                    this.error.show = true
                }
            });
        },
        checkOut() {
            this.log.type = "CheckOut"
            // post log data to backend
            fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.log)
            }).then((response) => {
                if (response.status === 200) {
                    this.$router.push('/logger')
                } else {
                    this.error.message = "Fehler beim Absenden des Logs"
                    this.error.show = true
                }
            });
        }
    }
}
</script>

<template>
    <div>
        <v-tabs v-model="tab" fixed-tabs center-active bg-color="background" dark density="comfortable">
            <v-tab value="CheckIn">CheckIn</v-tab>
            <v-tab value="CheckOut">CheckOut</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <!-- Checkin -->
            <v-window-item value="CheckIn">
                <v-form @submit.prevent="checkIn()">
                    <v-card>
                        <v-card-title>
                            Personalien
                        </v-card-title>
                        <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                        <v-card-text>
                            <v-text-field v-model="log.technician.name" clearable label="Name" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="log.technician.position" clearable label="Position in der Schule"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="log.technician.contact" clearable
                                label="E-Mail oder andere Kontaktmöglichkeit" density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Nutzung der Aula / Veranstaltung
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model="log.eventinfo.name" clearable label="Kurze Bezeichnung" density="compact"
                                :rules="[rules.required]" />
                            <v-textarea v-model="log.eventinfo.description" clearable label="Beschreibung"
                                :rules="[rules.required]" />
                            <v-text-field v-model="log.eventinfo.date" clearable label="Datum der Veranstaltung"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="log.eventinfo.time" clearable label="Aktuelle Uhrzeit" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="log.eventinfo.location" clearable label="Ort der Veranstaltung"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="log.eventinfo.url" clearable label="URL im System falls vorhanden"
                                density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Materialien
                        </v-card-title>
                        <v-card-text>
                            <v-checkbox label="Bühne" v-model="log.usage.stage" />
                            <v-checkbox label="Backstage" v-model="log.usage.backstage" />
                            <v-checkbox label="Regie" v-model="log.usage.regie" />
                            <v-checkbox label="Mobile Anlage" v-model="log.usage.mobile" />
                            <v-checkbox label="Stühle" v-model="log.usage.chairs" />
                            <v-checkbox label="Tische" v-model="log.usage.tables" />
                            <v-checkbox label="Bühnenelemente" v-model="log.usage.elements" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Checkliste
                        </v-card-title>
                        <v-card-subtitle>
                            Bitte unbedingt vor jeder Veranstaltung oder Nutzung der Aula durchgehen und ausfüllen!
                        </v-card-subtitle>
                        <v-card-text>
                            <v-expansion-panels v-model="expand" multiple>
                                <v-expansion-panel value="Aula" title="Aula">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="log.checklist.doorsClosed"
                                            label="Die Türen der Aula waren verschlossen"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.emergencyDoorsClosed"
                                            label="Die Notausgänge der Aula waren verschlossen"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.regieClosed"
                                            label="Die Tür der Regie war vollständig verschlossen"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.lightsOff"
                                            label="Die Lichter der Aula waren aus"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.beamerOff"
                                            label="Der Beamer war ausgeschaltet"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.clear" label="Die Aula war sauber"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Regie" title="Regie">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="log.checklist.regie"
                                            label="Die Regie war sauber und ordentlich"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.powerOn"
                                            label="Das I-Pad und der Laptop waren am laden"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.powerOff"
                                            label="Der Hauptschalter war aus"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Bühne" title="Bühne">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="log.checklist.stage" label="Die Bühne war sauber"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.backstage"
                                            label="Das Backstage war sauber und aufgeräumt"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Tische und Stühle" title="Tische und Stühle">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="log.checklist.chairs"
                                            label="Die Stühle waren ordnungsmäß an der Wand und im Stühlelager gelagert"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.tables"
                                            label="Die Tische waren ordnungsmäß unter der Bühne verstaut"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Auffälligkeiten
                        </v-card-title>
                        <v-card-text>
                            <v-textarea v-model="log.issues" clearable label="Auffälligkeiten" />
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
            <!-- Checkout -->
            <v-window-item value="CheckOut">
                <v-form @submit.prevent="checkOut()">
                    <v-card>
                        <v-card-title>
                            Personalien
                        </v-card-title>
                        <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                        <v-card-text>
                            <v-text-field v-model="log.technician.name" clearable label="Name" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="log.technician.position" clearable label="Position in der Schule"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="log.technician.contact" clearable
                                label="E-Mail oder andere Kontaktmöglichkeit" density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Nutzung der Aula / Veranstaltung
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model="log.eventinfo.name" clearable label="Kurze Bezeichnung" density="compact"
                                :rules="[rules.required]" />
                            <v-textarea v-model="log.eventinfo.description" clearable label="Beschreibung"
                                :rules="[rules.required]" />
                            <v-text-field v-model="log.eventinfo.date" clearable label="Datum der Veranstaltung"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="log.eventinfo.time" clearable label="Aktuelle Uhrzeit" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="log.eventinfo.location" clearable label="Ort der Veranstaltung"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="log.eventinfo.url" clearable label="URL im System falls vorhanden"
                                density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Materialien
                        </v-card-title>
                        <v-card-text>
                            <v-checkbox label="Bühne" v-model="log.usage.stage" />
                            <v-checkbox label="Backstage" v-model="log.usage.backstage" />
                            <v-checkbox label="Regie" v-model="log.usage.regie" />
                            <v-checkbox label="Mobile Anlage" v-model="log.usage.mobile" />
                            <v-checkbox label="Stühle" v-model="log.usage.chairs" />
                            <v-checkbox label="Tische" v-model="log.usage.tables" />
                            <v-checkbox label="Bühnenelemente" v-model="log.usage.elements" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Checkliste
                        </v-card-title>
                        <v-card-subtitle>
                            Bitte unbedingt nach jeder Veranstaltung oder Nutzung der Aula durchgehen und ausfüllen!
                        </v-card-subtitle>
                        <v-card-text>
                            <v-expansion-panels v-model="expand" multiple>
                                <v-expansion-panel value="Aula" title="Aula">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="log.checklist.doorsClosed"
                                            label="Die Türen der Aula sind verschlossen"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.emergencyDoorsClosed"
                                            label="Die Notausgänge der Aula sind verschlossen"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.regieClosed"
                                            label="Die Tür der Regie ist vollständig verschlossen"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.lightsOff"
                                            label="Die Lichter der Aula sind aus"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.beamerOff"
                                            label="Der Beamer ist ausgeschaltet"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.clear" label="Die Aula ist sauber"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Regie" title="Regie">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="log.checklist.regie"
                                            label="Die Regie ist sauber und ordentlich"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.powerOn"
                                            label="Das I-Pad und der Laptop sind am laden"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.powerOff"
                                            label="Der Hauptschalter ist aus"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Bühne" title="Bühne">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="log.checklist.stage" label="Die Bühne ist sauber"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.backstage"
                                            label="Das Backstage ist sauber und aufgeräumt"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Tische und Stühle" title="Tische und Stühle">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="log.checklist.chairs"
                                            label="Die Stühle sind ordnungsmäß an der Wand und im Stühlelager gelagert"></v-checkbox>
                                        <v-checkbox v-model="log.checklist.tables"
                                            label="Die Tische sind ordnungsmäß unter der Bühne verstaut"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Auffälligkeiten
                        </v-card-title>
                        <v-card-text>
                            <v-textarea v-model="log.issues" clearable label="Auffälligkeiten" />
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
