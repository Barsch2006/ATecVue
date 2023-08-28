<script lang="ts">
interface ILog {
    critical: boolean;
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
            tab: 'checkin',
            checkIn: {
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
                critical: false
            },
            checkOut: {
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
                critical: false
            }
        }
    },
    methods: {
        postcheckIn() {
            // post log data to backend
            this.checkIn.type = "CheckIn"
            fetch('/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.checkIn)
            }).then((response) => {
                if (response.status === 200) {
                    this.$router.push('/logger')
                } else {
                    this.error.message = "Fehler beim Absenden des Logs"
                    this.error.show = true
                }
            });
        },
        postcheckOut() {
            this.checkOut.type = "CheckOut"
            // post log data to backend
            fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.checkOut)
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
            <v-tab value="checkin">CheckIn</v-tab>
            <v-tab value="checkout">CheckOut</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <!-- Checkin -->
            <v-window-item value="checkin">
                <v-form @submit.prevent="postcheckIn()">
                    <v-card>
                        <v-card-title>
                            Personalien
                        </v-card-title>
                        <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                        <v-card-text>
                            <v-text-field v-model="checkIn.technician.name" clearable label="Name" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="checkIn.technician.position" clearable label="Position in der Schule"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="checkIn.technician.contact" clearable
                                label="E-Mail oder andere Kontaktmöglichkeit" density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Nutzung der Aula / Veranstaltung
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model="checkIn.eventinfo.name" clearable label="Kurze Bezeichnung" density="compact"
                                :rules="[rules.required]" />
                            <v-textarea v-model="checkIn.eventinfo.description" clearable label="Beschreibung"
                                :rules="[rules.required]" />
                            <v-text-field v-model="checkIn.eventinfo.date" clearable label="Datum der Veranstaltung"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="checkIn.eventinfo.time" clearable label="Aktuelle Uhrzeit" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="checkIn.eventinfo.location" clearable label="Ort der Veranstaltung"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="checkIn.eventinfo.url" clearable label="URL im System falls vorhanden"
                                density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Materialien
                        </v-card-title>
                        <v-card-text>
                            <v-checkbox label="Bühne" v-model="checkIn.usage.stage" />
                            <v-checkbox label="Backstage" v-model="checkIn.usage.backstage" />
                            <v-checkbox label="Regie" v-model="checkIn.usage.regie" />
                            <v-checkbox label="Mobile Anlage" v-model="checkIn.usage.mobile" />
                            <v-checkbox label="Stühle" v-model="checkIn.usage.chairs" />
                            <v-checkbox label="Tische" v-model="checkIn.usage.tables" />
                            <v-checkbox label="Bühnenelemente" v-model="checkIn.usage.elements" />
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
                                        <v-checkbox v-model="checkIn.checklist.doorsClosed"
                                            label="Die Türen der Aula waren verschlossen"></v-checkbox>
                                        <v-checkbox v-model="checkIn.checklist.emergencyDoorsClosed"
                                            label="Die Notausgänge der Aula waren verschlossen"></v-checkbox>
                                        <v-checkbox v-model="checkIn.checklist.regieClosed"
                                            label="Die Tür der Regie war vollständig verschlossen"></v-checkbox>
                                        <v-checkbox v-model="checkIn.checklist.lightsOff"
                                            label="Die Lichter der Aula waren aus"></v-checkbox>
                                        <v-checkbox v-model="checkIn.checklist.beamerOff"
                                            label="Der Beamer war ausgeschaltet"></v-checkbox>
                                        <v-checkbox v-model="checkIn.checklist.clear" label="Die Aula war sauber"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Regie" title="Regie">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="checkIn.checklist.regie"
                                            label="Die Regie war sauber und ordentlich"></v-checkbox>
                                        <v-checkbox v-model="checkIn.checklist.powerOn"
                                            label="Das I-Pad und der Laptop waren am laden"></v-checkbox>
                                        <v-checkbox v-model="checkIn.checklist.powerOff"
                                            label="Der Hauptschalter war aus"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Bühne" title="Bühne">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="checkIn.checklist.stage" label="Die Bühne war sauber"></v-checkbox>
                                        <v-checkbox v-model="checkIn.checklist.backstage"
                                            label="Das Backstage war sauber und aufgeräumt"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Tische und Stühle" title="Tische und Stühle">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="checkIn.checklist.chairs"
                                            label="Die Stühle waren ordnungsmäß an der Wand und im Stühlelager gelagert"></v-checkbox>
                                        <v-checkbox v-model="checkIn.checklist.tables"
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
                            <v-textarea v-model="checkIn.issues" clearable label="Auffälligkeiten" />
                            <v-checkbox v-model="checkIn.critical" label="Kritische Auffälligkeiten"></v-checkbox>
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
            <v-window-item value="checkout">
                <v-form @submit.prevent="postcheckOut()">
                    <v-card>
                        <v-card-title>
                            Personalien
                        </v-card-title>
                        <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                        <v-card-text>
                            <v-text-field v-model="checkOut.technician.name" clearable label="Name" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="checkOut.technician.position" clearable label="Position in der Schule"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="checkOut.technician.contact" clearable
                                label="E-Mail oder andere Kontaktmöglichkeit" density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Nutzung der Aula / Veranstaltung
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model="checkOut.eventinfo.name" clearable label="Kurze Bezeichnung" density="compact"
                                :rules="[rules.required]" />
                            <v-textarea v-model="checkOut.eventinfo.description" clearable label="Beschreibung"
                                :rules="[rules.required]" />
                            <v-text-field v-model="checkOut.eventinfo.date" clearable label="Datum der Veranstaltung"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="checkOut.eventinfo.time" clearable label="Aktuelle Uhrzeit" density="compact"
                                :rules="[rules.required]" />
                            <v-text-field v-model="checkOut.eventinfo.location" clearable label="Ort der Veranstaltung"
                                density="compact" :rules="[rules.required]" />
                            <v-text-field v-model="checkOut.eventinfo.url" clearable label="URL im System falls vorhanden"
                                density="compact" :rules="[rules.required]" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Materialien
                        </v-card-title>
                        <v-card-text>
                            <v-checkbox label="Bühne" v-model="checkOut.usage.stage" />
                            <v-checkbox label="Backstage" v-model="checkOut.usage.backstage" />
                            <v-checkbox label="Regie" v-model="checkOut.usage.regie" />
                            <v-checkbox label="Mobile Anlage" v-model="checkOut.usage.mobile" />
                            <v-checkbox label="Stühle" v-model="checkOut.usage.chairs" />
                            <v-checkbox label="Tische" v-model="checkOut.usage.tables" />
                            <v-checkbox label="Bühnenelemente" v-model="checkOut.usage.elements" />
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
                                        <v-checkbox v-model="checkOut.checklist.doorsClosed"
                                            label="Die Türen der Aula sind verschlossen"></v-checkbox>
                                        <v-checkbox v-model="checkOut.checklist.emergencyDoorsClosed"
                                            label="Die Notausgänge der Aula sind verschlossen"></v-checkbox>
                                        <v-checkbox v-model="checkOut.checklist.regieClosed"
                                            label="Die Tür der Regie ist vollständig verschlossen"></v-checkbox>
                                        <v-checkbox v-model="checkOut.checklist.lightsOff"
                                            label="Die Lichter der Aula sind aus"></v-checkbox>
                                        <v-checkbox v-model="checkOut.checklist.beamerOff"
                                            label="Der Beamer ist ausgeschaltet"></v-checkbox>
                                        <v-checkbox v-model="checkOut.checklist.clear" label="Die Aula ist sauber"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Regie" title="Regie">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="checkOut.checklist.regie"
                                            label="Die Regie ist sauber und ordentlich"></v-checkbox>
                                        <v-checkbox v-model="checkOut.checklist.powerOn"
                                            label="Das I-Pad und der Laptop sind am laden"></v-checkbox>
                                        <v-checkbox v-model="checkOut.checklist.powerOff"
                                            label="Der Hauptschalter ist aus"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Bühne" title="Bühne">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="checkOut.checklist.stage" label="Die Bühne ist sauber"></v-checkbox>
                                        <v-checkbox v-model="checkOut.checklist.backstage"
                                            label="Das Backstage ist sauber und aufgeräumt"></v-checkbox>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel value="Tische und Stühle" title="Tische und Stühle">
                                    <v-expansion-panel-text>
                                        <v-checkbox v-model="checkOut.checklist.chairs"
                                            label="Die Stühle sind ordnungsmäß an der Wand und im Stühlelager gelagert"></v-checkbox>
                                        <v-checkbox v-model="checkOut.checklist.tables"
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
                            <v-textarea v-model="checkOut.issues" clearable label="Auffälligkeiten" />
                            <v-checkbox v-model="checkOut.critical" label="Kritische Auffälligkeiten"></v-checkbox>
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
