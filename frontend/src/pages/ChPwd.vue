<!-- password change form -->
<script lang="ts">

export default {

    data() {
        return {
            oldPassword: "",
            changedPassword: "",
            newPasswordConfirm: "",
            rules: {
                required: (value: string) => !!value || "Required.",
                minChars: (v: string) => v.length >= 12 || "Passwort muss mindestens 12 Buchstaben lang sein",
                letters: (v: string) => /[a-z]/.test(v) || "Passwort muss mindestens einen Kleinbuchstaben enthalten",
                capitals: (v: string) => /[A-Z]/.test(v) || "Passwort muss mindestens einen Großbuchstaben enthalten",
                numbers: (v: string) => /[0-9]/.test(v) || "Passwort muss mindestens eine Zahl enthalten",
                specialChars: (v: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v) || "Passwort muss mindestens ein Sonderzeichen enthalten",
            },
            button: {
                loading: false,
                disabled: false,
                color: "",
                icon: "mdi-form-textbox-password",
                text: "Ändern"
            }
        }
    },
    methods: {
        async changePassword() {
            this.button.loading = true;
            this.button.disabled = true;
            try {

                const response = await fetch("/chpwd", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        oldPassword: this.oldPassword,
                        newPassword: this.changedPassword
                    }),
                })

                if (response.status === 200) {
                    this.button.loading = false;
                    this.button.disabled = true;
                    this.button.color = "success";
                    this.button.icon = "mdi-check";
                    this.button.text = "Passwort geändert";
                    setTimeout(() => this.$router.push("/home"), 3000);
                } else {
                    this.button.loading = false;
                    this.button.disabled = false;
                    this.button.color = "error";
                    this.button.icon = "mdi-alert-circle";
                    this.button.text = "Fehler";
                }

            } catch {
                this.button.loading = false;
                this.button.disabled = false;
                this.button.color = "error";
                this.button.icon = "mdi-alert-circle";
                this.button.text = "Fehler";
            }
        }
    }

}

</script>
<template>
    <v-card>
        <v-card-title>
            Passwort ändern
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-text-field v-model="oldPassword" :rules="[rules.required]" label="Altes Passwort" type="password" />
                <v-text-field v-model="changedPassword"
                    :rules="[rules.required, rules.minChars, rules.letters, rules.capitals, rules.numbers, rules.specialChars]"
                    label="Neues Passwort" type="password" />
                <v-text-field v-model="newPasswordConfirm"
                    :rules="[rules.required, (v) => v === changedPassword || 'Passwörter stimmen nicht überein']"
                    label="Neues Passwort bestätigen" type="password" />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                :color="button.color"
                :prepend-icon="button.icon"
                :loading="button.loading"
                :disabled="button.disabled"
                @click="changePassword()"
            >{{ button.text }}</v-btn>
        </v-card-actions>
    </v-card>
</template>