<script lang="ts">
export default {
    data() {
        return {
            users: Array<{
                id: number;
                username: string;
                permissionLevel: "locked" | "user" | "technician" | "admin";
                password: string;
            }>(),
            changeUser: false,
            createUser: false,
            changeId: Number() || null,
            changeName: String() || null,
            changePwd: String() || null,
            changeLevel: String() || null,
            createName: String() || null,
            createPwd: String() || null,
            createLevel: String() || null
        }
    },
    beforeMount() {
        fetch("/users", {
            method: "get",
            headers: {
                    "Content-Type": "application/json"
                },
        }).then((response) => {
            response.json().then((data) => {
                this.users = data;
            });
        });
    },
    methods: {
        deleteUser(id: number) {
            fetch(`/user/${id}`, {
                method: 'delete',
                headers: {
                    "Content-Type": "application/json"
                },
            });
        },
        updateUser() {
            fetch('/user', {
                method: 'put',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: this.changeName,
                    password: this.changePwd,
                    permissionLevel: this.changeLevel
                })
            });
        },
        createNewUser() {
            fetch('/user', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: this.createName,
                    password: this.createName,
                    permissionLevel: this.createName
                })
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
                    <v-form @submit.prevent="updateUser()">
                        <v-text-field v-model="changeId" label="ID" />
                        <v-text-field v-model="changeName" label="Benutzername" />
                        <v-text-field v-model="changePwd" label="Passwort" />
                        <v-select v-model="changeLevel" label="Permission-Level"
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
                    <v-form @submit.prevent="createNewUser()">
                        <v-text-field v-model="createName" label="Benutzername" />
                        <v-text-field v-model="createPwd" label="Passwort" />
                        <v-select v-model="createLevel" label="Permission-Level"
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
}
</style>
