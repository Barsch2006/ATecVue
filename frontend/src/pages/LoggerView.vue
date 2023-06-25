<script lang="ts">
export default {
    data() {
        return {
            issues: Array<{
                date: string;
                time: string;
                name: string;
                type: "Nutzung" | "Misstand" | "Sonstiges";
                text: string;
            }>(),
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
            <v-expansion-panel disable-icon-rotate v-for="(issue, index) in issues" :key="index">>
                <v-expansion-panel-title>
                    <v-expansion-panel-header-title>
                        <template v-slot:actions>
                            <v-icon v-if="issue.type == 'Nutzung'" color="success" icon="mdi-alert-information-slab-circle-outline"></v-icon>
                            <v-icon v-if="issue.type == 'Misstand'" color="error" icon="mdi-alert-circle"></v-icon>
                            <v-icon v-if="issue.type == 'Sonstiges'" color="info" icon="mdi-help-circle-outline"></v-icon>
                        </template>
                        {{ issue.date }} {{ issue.time }}
                    </v-expansion-panel-header-title>
                    <v-expansion-panel-header-subtitle>
                        {{ issue.name }}
                    </v-expansion-panel-header-subtitle>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-textarea disabled v-model="issue.text"></v-textarea>
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
