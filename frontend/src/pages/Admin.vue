<script lang="ts">
export default {
    data() {
        return {
            users: Array<{
                id: number;
                username: string;
                permissionLevel: "locked" | "user" | "technician" | "admin";
                password: string;
            }>(
                {
                    id: 0,
                    username: "test",
                    permissionLevel: "user",
                    password: "test"
                }
            ),
            changeUser: false,
            createUser: false
        }
    },
    beforeMount() {
        fetch('/admin/users').then((response) => {
            response.json().then((data) => {
                this.users = data;
            });
        });
    }
}
</script>

<template>
    <div>
        <v-table fixed-header>
            <thead>
                <tr>
                    <th class="text-left">
                        ID
                    </th>
                    <th class="text-left">
                        Benutzername
                    </th>
                    <th class="text-left">
                        Permission-Level
                    </th>
                    <th class="text-left">
                        Passwort
                    </th>
                    <th class="text-left">
                        Bearbeiten
                    </th>
                    <th class="text-left">
                        Löschen
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in users" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.username }}</td>
                    <td>{{ item.permissionLevel }}</td>
                    <td>{{ item.password }}</td>
                    <td>
                        <v-btn elevation="0" @click="changeUser = true" icon="mdi-pencil"></v-btn>
                    </td>
                    <td>
                        <v-btn elevation="0" icon="mdi-delete"></v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-dialog v-model="changeUser">
            <v-form action="/changeuser" method="post">
                <v-card>
                    <v-card-title>
                        Benutzer bearbeiten
                    </v-card-title>
                    <v-card-text>
                        <!-- todo -->
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="changeUser = false">
                            Änderungen verwerfen
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <v-dialog v-model="createUser">
            <v-form action="/createuser" method="post">
                <v-card>
                    <v-card-title>
                        neuer Benutzer
                    </v-card-title>
                    <v-card-text>
                        <!-- todo -->
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="createUser = false">
                            Änderungen verwerfen
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <v-btn class="floating_action_btn" @click="createUser = true" color="primary" icon="mdi-plus" rounded
            title="Neuer Benutzer" />
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
