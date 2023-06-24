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
            createUser: false,
            changeId: String() || null || undefined || Number(),
            changeName: String() || null || undefined || Number(),
            changePwd: String() || null || undefined || Number(),
            changeLevel: String() || null || undefined || Number()
        }
    },
    beforeMount() {
        fetch('/admin/users').then((response) => {
            response.json().then((data) => {
                this.users = data;
            });
        });
    },
    methods: {
        deleteUser(id: number) {
            fetch('/deleteuser', {
                method: 'POST',
                body: JSON.stringify({
                    id: id
                })
            }).then((response) => {
                response.json().then((data) => {
                    this.users = data;
                });
            });
        }
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
                        <v-btn elevation="0"
                            @click="changeId = item.id; changeName = item.username; changePwd = item.password; changeLevel = item.permissionLevel; changeUser = true;"
                            icon="mdi-pencil"></v-btn>
                    </td>
                    <td>
                        <v-btn elevation="0" @click="deleteUser(item.id)" icon="mdi-delete"></v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-dialog v-model="changeUser">
            <v-card>
                <v-card-title>
                    Benutzer bearbeiten
                </v-card-title>
                <v-card-text>
                    <v-form action="/updateuser" method="post">
                        <v-text-field label="ID" name="id" v-model="changeId" />
                        <v-text-field label="Benutzername" v-model="changeName" name="username" />
                        <v-text-field label="Passwort" v-model="changePwd" name="password" />
                        <v-select label="Permission-Level" name="permissionLevel"
                            :items="['locked', 'user', 'technician', 'admin']" />
                        <v-btn type="submit">
                            Änderungen speichern
                        </v-btn>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="changeUser = false">
                        Änderungen verwerfen
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="createUser">
                <v-card>
                    <v-card-title>
                        neuer Benutzer
                    </v-card-title>
                    <v-card-text>
                        <v-form action="/createuser" method="post">
                            <v-text-field label="Benutzername" name="username" />
                            <v-text-field label="Passwort" name="password" />
                            <v-select label="Permission-Level" name="permissionLevel"
                                :items="['locked', 'user', 'technician', 'admin']" />
                            <v-btn type="submit">
                                Änderungen speichern
                            </v-btn>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="createUser = false">
                            Änderungen verwerfen
                        </v-btn>
                    </v-card-actions>
                </v-card>
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
}</style>
