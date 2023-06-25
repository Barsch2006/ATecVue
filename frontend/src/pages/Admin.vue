<script lang="ts">
export default {
    data() {
        return {
            users: Array<{
                _id: number | string;
                username: string;
                permissionLevel: "locked" | "user" | "technician" | "admin";
                password: string;
                contactAdress: string;
                dId: string;
            }>(),
            changeUser: false,
            createUser: false,
            changeId: String() || null,
            changeName: String() || null,
            changePwd: String() || null,
            changeLevel: String() || null,
            createName: String() || null,
            createPwd: String() || null,
            createLevel: String() || null,
            createContactAdress: String() || null,
            changeContactAdress: String() || null,
            createdId: String() || null,
            changedId: String() || null
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
        deleteUser(id: number | string) {
            fetch(`/user/${id.toString()}`, {
                method: 'delete',
                headers: {
                    "Content-Type": "application/json"
                },
            });
        },
        updateUser() {
            fetch('/user/update', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    _id: this.changeId,
                    username: this.changeName,
                    password: this.changePwd,
                    permissionLevel: this.changeLevel,
                    contactAdress: this.changeContactAdress,
                    dId: this.changedId
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
                    password: this.createPwd,
                    permissionLevel: this.createLevel,
                    contactAdress: this.createContactAdress,
                    dId: this.createdId
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
                        Kontaktadresse
                    </th>
                    <th class="text-left">
                        Discord-ID
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
                <tr v-for="item in users" :key="item._id">
                    <td>{{ item._id }}</td>
                    <td>{{ item.username }}</td>
                    <td>{{ item.permissionLevel }}</td>
                    <td>{{ item.password }}</td>
                    <td>{{ item.contactAdress }}</td>
                    <td>{{ item.dId }}</td>
                    <td>
                        <v-btn elevation="0"
                            @click="changeId = item._id.toString(); changedId = item.dId; changeContactAdress = item.contactAdress; changeName = item.username; changePwd = item.password; changeLevel = item.permissionLevel; changeUser = true;"
                            icon="mdi-pencil"></v-btn>
                    </td>
                    <td>
                        <v-btn elevation="0" @click="deleteUser(item._id)" icon="mdi-delete"></v-btn>
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
                        <v-text-field v-model="changeContactAdress" label="KontaktAdresse" />
                        <v-text-field v-model="changedId" label="Discord-ID" />
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
                        <v-text-field v-model="createContactAdress" label="KontaktAdresse" />
                        <v-text-field v-model="createdId" label="Discord-ID" />
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
