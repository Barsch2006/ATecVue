<script lang="ts">
interface ILog {
    type: "CheckIn" | "CheckOut";
    name: string;
    lastname: string;
    position: string;
    contact: string;

    event_name: string;
    event_description: string;
    event_date: string;
    event_time: string;
    event_location: string;

    usage_aula: boolean;
    usage_stage: boolean;
    usage_backstage: boolean;
    usage_regie: boolean;
    usage_chairs: boolean;
    usage_mobile: boolean;

    checklist: {
        doorsClosed: boolean,
        emergencyDoorsClosed: boolean,
        lightsOff: boolean,
        backstageLightsOff: boolean,
        systemOff: boolean,
        lockesClosed: boolean,
    },
}

export default {
    data() {
        return {
            issues: Array<ILog>(),
            error: {
                show: false,
                message: ''
            }
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
                response.json().then((data) => {
                    this.issues = data;
                });
            }
        }).catch((error) => {
            this.error.show = true;
            this.error.message = error;
        })
    },
}
</script>

<template>
    <div>
        <v-alert v-if="error.show" type="error">
            {{ error.message }}
        </v-alert>

        <v-expansion-panels>
            <v-expansion-panel disable-icon-rotate v-for="(issue, index) in issues" :key="index">
                <v-expansion-panel-title disable-icon-rotate>
                    {{ issue.type }}: {{ issue.event_date }} {{ issue.event_time }} - {{ issue.event_name }}
                    <template v-slot:actions>
                        <v-icon :color="issue.type == 'CheckIn' ? 'success' : 'warning'"
                            :icon="issue.type == 'CheckIn' ? 'mdi-login-variant' : 'mdi-logout-variant'"></v-icon>
                    </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-text-field label="Vorname" readonly v-model="issue.name"></v-text-field>
                    <v-text-field label="Nachname" readonly v-model="issue.lastname"></v-text-field>
                    <v-text-field label="Position" readonly v-model="issue.position"></v-text-field>
                    <v-text-field label="Kontakt" readonly v-model="issue.contact"></v-text-field>
                    <v-text-field label="Veranstaltung" readonly v-model="issue.event_name"></v-text-field>
                    <v-textara label="Beschreibung" readonly v-model="issue.event_description"></v-textara>
                    <v-text-field label="Ort" readonly v-model="issue.event_location"></v-text-field>
                    <v-checkbox readonly v-model="issue.usage_aula" label="Aula benutzt"></v-checkbox>
                    <v-checkbox readonly v-model="issue.usage_stage" label="Bühne benutzt"></v-checkbox>
                    <v-checkbox readonly v-model="issue.usage_backstage" label="Backstage benutzt"></v-checkbox>
                    <v-checkbox readonly v-model="issue.usage_chairs" label="Stühle benutzt"></v-checkbox>
                    <v-checkbox readonly v-model="issue.usage_regie" label="Regie benutzt"></v-checkbox>
                    <v-checkbox readonly v-model="issue.usage_mobile" label="Mobile Anlage benutzt"></v-checkbox>
                    <v-checkbox readonly v-model="issue.checklist.doorsClosed" label="Türen geschlossen"></v-checkbox>
                    <v-checkbox readonly v-model="issue.checklist.emergencyDoorsClosed"
                        label="Notausgänge geschlossen"></v-checkbox>
                    <v-checkbox readonly v-model="issue.checklist.lightsOff" label="Licht aus"></v-checkbox>
                    <v-checkbox readonly v-model="issue.checklist.backstageLightsOff"
                        label="Backstage Licht aus"></v-checkbox>
                    <v-checkbox readonly v-model="issue.checklist.systemOff" label="Anlage aus"></v-checkbox>
                    <v-checkbox readonly v-model="issue.checklist.lockesClosed" label="Schlösser geschlossen"></v-checkbox>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-btn class="floating_action_btn" @click="$router.push('/logger/create')" color="primary" icon="mdi-plus" rounded
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
