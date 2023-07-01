<script lang="ts">
interface ILog {
    type: "CheckIn" | "CheckOut",
    technician: {
        name: string,
        position: string,
        contact: string,
    },
    eventinfo: {
        name: string,
        description: string,
        date: string,
        time: string,
        location: string,
        url: string
    },
    usage: {
        // anlage
        regie: boolean,
        mobile: boolean,
        // bühne
        stage: boolean,
        backstage: boolean,
        // stühle und tische
        chairs: boolean,
        tables: boolean,
        elements: boolean
    },
    checklist: {
        doorsClosed: boolean,
        emergencyDoorsClosed: boolean,
        regieClosed: boolean,
        lightsOff: boolean,
        beamerOff: boolean,
        clear: boolean,
        regie: boolean,
        powerOn: boolean,
        powerOff: boolean,
        stage: boolean,
        backstage: boolean,
        chairs: boolean,
        tables: boolean,
    },
    issues: string,
    critical: boolean,
}

export default {
    data() {
        return {
            logs: Array<ILog>(),
            error: {
                show: false,
                message: ''
            },
            admin: false,
            del: false
        }
    },
    mounted() {
        fetch('/logs', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.status != 200) {
                this.error.show = true;
                this.error.message = response.statusText;
            } else {
                response.json().then((data: ILog[]) => {
                    this.logs = data;
                });
            }
        }).catch((error) => {
            this.error.show = true;
            this.error.message = error;
        })
    },
    beforeMount() {
        fetch("/checkaccess", { method: "GET" })
            .then((response) => {

                if (response.status === 401) {
                    this.$router.push("/login");
                }

                return response.json();
            })
            .then((data) => {
                if (data.adminAccess && typeof data.adminAccess === "string" && data.adminAccess === "granted") {
                    this.admin = true;
                }
            })
    },
    methods: {
        clearLogs() {
            fetch('/logs', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.status != 200) {
                    this.error.show = true;
                    this.error.message = response.statusText;
                } else {
                    this.logs = [];
                    this.del = false;
                }
            }).catch((error) => {
                this.error.show = true;
                this.error.message = error;
            })
        }
    }
}
</script>

<template>
    <div>
        <v-alert v-if="error.show" type="error">
            {{ error.message }}
        </v-alert>

        <v-card v-if="admin">
            <v-card-title>
                Clear Logs
            </v-card-title>
            <v-card-text>
                Alle Logs löschen und zurücksetzen. <br>
                Diese Aktion kann nicht rückgängig gemacht werden und ist nicht zu empfehlen, wenn kritische Logs noch nicht
                behoben wurden, und es noch keine Backups gibt.
            </v-card-text>
            <v-card-actions>
                <v-checkbox v-model="del" label="Löschen"></v-checkbox>
                <v-btn @click="clearLogs()" :disabled="!del">
                    Entgültig Löschen
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-expansion-panels>
            <v-expansion-panel disable-icon-rotate v-for="(log, index) in logs" :key="index">
                <v-expansion-panel-title :color="log.critical ? 'warning' : undefined" disable-icon-rotate>
                    {{ log.type }}: {{ log.eventinfo.date }} {{ log.eventinfo.time }}
                    <template v-slot:actions>
                        <v-icon :color="log.type == 'CheckIn' ? 'success' : 'warning'"
                            :icon="log.type == 'CheckIn' ? 'mdi-login-variant' : 'mdi-logout-variant'"></v-icon>
                    </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-card>
                        <v-card-title>
                            Personalien
                        </v-card-title>
                        <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
                        <v-card-text>
                            <v-text-field v-model="log.technician.name" clearable label="Name" density="compact" readonly />
                            <v-text-field v-model="log.technician.position" clearable label="Position in der Schule"
                                density="compact" readonly />
                            <v-text-field v-model="log.technician.contact" clearable
                                label="E-Mail oder andere Kontaktmöglichkeit" density="compact" readonly />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Nutzung der Aula / Veranstaltung
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model="log.eventinfo.name" clearable label="Kurze Bezeichnung" density="compact"
                                readonly />
                            <v-textarea v-model="log.eventinfo.description" clearable label="Beschreibung" readonly />
                            <v-text-field v-model="log.eventinfo.date" clearable label="Datum der Veranstaltung"
                                density="compact" readonly />
                            <v-text-field v-model="log.eventinfo.time" clearable label="Aktuelle Uhrzeit" density="compact"
                                readonly />
                            <v-text-field v-model="log.eventinfo.location" clearable label="Ort der Veranstaltung"
                                density="compact" readonly />
                            <v-text-field v-model="log.eventinfo.url" clearable label="URL im System falls vorhanden"
                                density="compact" readonly />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Materialien
                        </v-card-title>
                        <v-card-text>
                            <v-checkbox readonly label="Bühne" v-model="log.usage.stage" />
                            <v-checkbox readonly label="Backstage" v-model="log.usage.backstage" />
                            <v-checkbox readonly label="Regie" v-model="log.usage.regie" />
                            <v-checkbox readonly label="Mobile Anlage" v-model="log.usage.mobile" />
                            <v-checkbox readonly label="Stühle" v-model="log.usage.chairs" />
                            <v-checkbox readonly label="Tische" v-model="log.usage.tables" />
                            <v-checkbox readonly label="Bühnenelemente" v-model="log.usage.elements" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Checkliste
                        </v-card-title>
                        <v-card-text>
                            <v-checkbox readonly v-model="log.checklist.doorsClosed"
                                label="Die Türen der Aula sind/ waren verschlossen"></v-checkbox>
                            <v-checkboxreadonly readonly v-model="log.checklist.emergencyDoorsClosed"
                                label="Die Notausgänge der Aula sind/ waren verschlossen"></v-checkboxreadonly>
                            <v-checkbox readonly v-model="log.checklist.regieClosed"
                                label="Die Tür der Regie ist/ war vollständig verschlossen"></v-checkbox>
                            <v-checkbox readonly v-model="log.checklist.lightsOff"
                                label="Die Lichter der Aula sind/ waren aus"></v-checkbox>
                            <v-checkbox readonly v-model="log.checklist.beamerOff"
                                label="Der Beamer ist/ war ausgeschaltet"></v-checkbox>
                            <v-checkbox readonly v-model="log.checklist.clear"
                                label="Die Aula ist/ war sauber"></v-checkbox>
                            <v-checkbox readonly v-model="log.checklist.regie"
                                label="Die Regie ist/ war sauber und ordentlich"></v-checkbox>
                            <v-checkbox readonly v-model="log.checklist.powerOn"
                                label="Das I-Pad und der Laptop sind/ waren am laden"></v-checkbox>
                            <v-checkbox readonly v-model="log.checklist.powerOff"
                                label="Der Hauptschalter ist/ war aus"></v-checkbox>

                            <v-checkbox readonly v-model="log.checklist.stage" label="Die Bühne war sauber"></v-checkbox>
                            <v-checkbox readonly v-model="log.checklist.backstage"
                                label="Das Backstage ist/ war sauber und aufgeräumt"></v-checkbox>

                            <v-checkbox readonly v-model="log.checklist.chairs"
                                label="Die Stühle sind/ waren ordnungsmäß an der Wand und im Stühlelager gelagert"></v-checkbox>
                            <v-checkbox readonly v-model="log.checklist.tables"
                                label="Die Tische sind/ waren ordnungsmäß unter der Bühne verstaut"></v-checkbox>
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Auffälligkeiten
                        </v-card-title>
                        <v-card-text>
                            <v-textarea readonly v-model="log.issues" clearable label="Auffälligkeiten" />
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-btn class="floating_action_btn" @click="$router.push('/checkinout')" color="primary" icon="mdi-plus" rounded
            title="Neuer Eintrag" />
    </div>
</template>

<style scoped>
.floating_action_btn {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 20px;
}
</style>
