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
      changeId: String() || undefined,
      changeName: String() || undefined,
      changePwd: String() || undefined,
      changeLevel: String() || undefined,
      createName: String() || undefined,
      createPwd: String() || undefined,
      createLevel: String() || undefined,
      createContactAdress: String() || undefined,
      changeContactAdress: String() || undefined,
      createdId: String() || undefined,
      changedId: String() || undefined,
      error: {
        show: false,
        message: "",
      },
      editUserButton: {
        loading: false,
        disabled: false,
        text: "Änderungen speichern",
        icon: "mdi-content-save",
        color: "",
      },
      createUserButton: {
        loading: false,
        disabled: false,
        text: "Benutzer erstellen",
        icon: "mdi-account-plus",
        color: "",
      },
      deleteButtons: {

      } as {
        [key: string]: {
          loading?: boolean;
          icon?: string;
          disabled?: boolean;
        }
      },
    };
  },
  beforeMount() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      fetch("/users", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.status !== 200) {
          this.error.show = true;
          this.error.message = response.statusText;
        } else {
          try {
            response.json().then((data) => {
              this.users = data;
            });
          } catch {
            this.error.show = true;
            this.error.message = "Fehler beim parsen der Daten";
          }
        }
      });
    },
    deleteUser(id: number | string) {
      this.deleteButtons[id.toString()] = {
        loading: false,
        icon: "mdi-delete",
        disabled: false
      }
      fetch(`/user/${id.toString()}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            this.error.show = true;
            this.error.message = res.statusText;
            this.deleteButtons[id.toString()].loading = false;
            this.deleteButtons[id.toString()].disabled = true;
            this.deleteButtons[id.toString()].icon = "mdi-alert";
            setTimeout(() => {
              this.deleteButtons[id.toString()].disabled = false;
              this.deleteButtons[id.toString()].icon = "mdi-delete";
              this.loadUsers()
            }, 3000);
            return;
          }
          this.deleteButtons[id.toString()].loading = false;
          this.deleteButtons[id.toString()].disabled = true;
          this.deleteButtons[id.toString()].icon = "mdi-check";
        })
        .catch((err) => {
          this.error.show = true;
          this.error.message = err;
          this.deleteButtons[id.toString()].loading = false;
          this.deleteButtons[id.toString()].disabled = true;
          this.deleteButtons[id.toString()].icon = "mdi-alert";
          setTimeout(() => {
            this.deleteButtons[id.toString()].disabled = false;
            this.deleteButtons[id.toString()].icon = "mdi-delete";
          }, 3000);
        });
    },
    updateUser() {
      this.editUserButton.loading = true;
      this.editUserButton.disabled = true;
      fetch("/user/update", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: this.changeId,
          username: this.changeName,
          permissionLevel: this.changeLevel,
          contactAdress: this.changeContactAdress,
          dId: this.changedId || undefined,
        }),
      })
        .then((res) => {
          if (res.status !== 200) {
            this.error.show = true;
            this.error.message = res.statusText;
            this.loadUsers()
            return;
          }
          this.editUserButton.loading = false;
          this.editUserButton.text = "Erfolgreich";
          this.editUserButton.icon = "mdi-check";
          this.editUserButton.color = "success";
          setTimeout(() => {
            this.changeUser = false;

            this.editUserButton.disabled = false;
            this.editUserButton.text = "Änderungen speichern";
            this.editUserButton.icon = "mdi-content-save";
            this.editUserButton.color = "";
          }, 3_000);
          this.loadUsers()
        })
        .catch((err) => {
          this.error.show = true;
          this.error.message = err;

          this.editUserButton.loading = false;
          this.editUserButton.text = "Fehler";
          this.editUserButton.icon = "mdi-alert";
          this.editUserButton.color = "error";
          this.editUserButton.disabled = true;

          setTimeout(() => {
            this.editUserButton.disabled = false;
            this.editUserButton.text = "Änderungen speichern";
            this.editUserButton.icon = "mdi-content-save";
            this.editUserButton.color = "";
          }, 3_000);
          this.loadUsers()
        });
    },
    createNewUser() {
      this.createUserButton.loading = true;
      this.createUserButton.disabled = true;
      fetch("/user", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.createName,
          password: this.createPwd,
          permissionLevel: this.createLevel,
          contactAdress: this.createContactAdress,
          dId: this.createdId || undefined,
        }),
      })
        .then((res) => {
          if (res.status !== 200) {
            this.error.show = true;
            this.error.message = res.statusText;
            this.createUserButton.loading = false;
            this.createUserButton.text = "Fehler";
            this.createUserButton.icon = "mdi-alert";
            this.createUserButton.color = "error";
            this.createUserButton.disabled = true;
            this.loadUsers()
            return;
          }
          this.createUserButton.loading = false;
          this.createUserButton.text = "Erfolgreich";
          this.createUserButton.icon = "mdi-check";
          this.createUserButton.color = "success";
          this.createUserButton.disabled = true;
          setTimeout(() => {
            this.createUser = false;
            // reset dialog
            this.createUserButton.loading = false;
            this.createUserButton.text = "Erstellen";
            this.createUserButton.icon = "mdi-account-plus";
            this.createUserButton.color = "";
          }, 3_000);
          this.loadUsers()
        })
        .catch((err) => {
          this.error.show = true;
          this.error.message = err;
          this.createUserButton.loading = false;
          this.createUserButton.text = "Fehler";
          this.createUserButton.icon = "mdi-alert";
          this.createUserButton.color = "error";
          this.createUserButton.disabled = true;
          setTimeout(() => {
            this.createUser = false;
            // reset dialog
            this.createUserButton.loading = false;
            this.createUserButton.text = "Erstellen";
            this.createUserButton.icon = "mdi-account-plus";
            this.createUserButton.color = "";
          }, 3_000);
          this.loadUsers()
        });
    },
  },
};
</script>

<template>
  <div>
    <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
    <v-table fixed-header>
      <thead>
        <tr>
          <th class="text-left">Benutzername</th>
          <th class="text-left">Permission-Level</th>
          <th class="text-left">Kontaktadresse</th>
          <th class="text-left">Discord-ID</th>
          <th class="text-left">Optionen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item._id">
          <td>{{ item.username }}</td>
          <td>{{ item.permissionLevel }}</td>
          <td>{{ item.contactAdress }}</td>
          <td>{{ item.dId }}</td>
          <td>
            <v-btn
              elevation="0"
              @click="
                changeId = item._id.toString();
                changedId = item.dId;
                changeContactAdress = item.contactAdress;
                changeName = item.username;
                changeLevel = item.permissionLevel;
                changeUser = true;
              "
              icon="mdi-pencil"
            ></v-btn>
            <v-btn elevation="0" @click="deleteUser(item._id)"
            :icon="deleteButtons[item._id]?.icon ?? 'mdi-delete'"
            :loading="deleteButtons[item._id]?.loading ?? false"
            :disabled="deleteButtons[item._id]?.disabled ?? false"
            ></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="changeUser">
      <v-card>
        <v-card-title> Benutzer bearbeiten </v-card-title>
        <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
        <v-card-text>
          <v-form @submit.prevent="updateUser()">
            <v-text-field readonly v-model="changeId" label="ID" />
            <v-text-field readonly v-model="changeName" label="Benutzername" />
            <v-text-field v-model="changeContactAdress" label="KontaktAdresse" />
            <v-text-field v-model="changedId" label="Discord-ID" />
            <v-select
              v-model="changeLevel"
              label="Permission-Level"
              :items="['locked', 'user', 'technician', 'admin']"
            />
            <v-btn type="submit" :prepend-icon="editUserButton.icon" :loading="editUserButton.loading" :disabled="editUserButton.disabled">{{ editUserButton.text }} </v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="changeUser = false" >Änderungen verwerfen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="createUser">
      <v-card>
        <v-card-title> neuer Benutzer </v-card-title>
        <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
        <v-card-text>
          <v-form @submit.prevent="createNewUser()">
            <v-text-field v-model="createName" label="Benutzername" />
            <v-text-field v-model="createPwd" label="Passwort" />
            <v-text-field v-model="createContactAdress" label="KontaktAdresse" />
            <v-text-field v-model="createdId" label="Discord-ID" />
            <v-select
              v-model="createLevel"
              label="Permission-Level"
              :items="['locked', 'user', 'technician', 'admin']"
            />
            <v-btn type="submit"
              :disabled="createUserButton.disabled"
              :loading="createUserButton.loading"
              :prepend-icon="createUserButton.icon"
              :color="createUserButton.color"
            > {{ createUserButton.text }} </v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="createUser = false"> Änderungen verwerfen </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      class="floating_action_btn"
      @click="createUser = true"
      color="primary"
      icon="mdi-plus"
      rounded
      title="Neuer Benutzer"
    />
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
