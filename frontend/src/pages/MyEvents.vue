<script lang="ts">
export default {
  data() {
    return {
      events: Array<{ url: string; name: string }>(),
      selected: Number() || undefined,
      dialog: false,
      error: {
        show: false,
        message: "",
      },
      button: {
        disabled: false,
        loading: false,
        text: "Hochladen",
        icon: "mdi-send",
        color: "",
      },
      files: [],
    };
  },
  async beforeMount() {
    const result = await fetch("/events/created").catch(() => {
      this.error.message = "Verbindung zum Server ist fehlgeschlagen!";
      this.error.show = true;
    });

    if (!result) return;

    if (result.status !== 200) {
      this.error.message =
        "Eintrag fehlgeschlagen. Bitte versuchen Sie es erneut!";
      if (result.status === 401) {
        this.error.message = "Sie sind nicht angemeldet!";
        this.button.color = "error";
        this.button.icon = "mdi-alert";
        this.button.text = "Login erforderlich";
        this.button.disabled = true;
        setTimeout(() => {
          this.$router.push("/");
        }, 1500);
      }
      this.error.show = true;
    } else {
      this.events = await result.json();
    }
  },
  methods: {
    async openDialog(id: number) {
      this.selected = id;
      this.dialog = true;
    },
    async sendData() {
      if (this.selected == undefined) {
        console.log(this.selected);
        return;
      }
      if (this.files.length == 0) return;

      this.button.loading = true;
      this.button.disabled = true;

      const formData = new FormData();
      this.files.forEach((file) => {
        formData.append("files", file);
      });

      const result = await fetch(this.events[this.selected].url, {
        method: "POST",
        body: formData,
      }).catch(() => {
        this.error.message = "Verbindung zum Server ist fehlgeschlagen!";
        this.error.show = true;
      });

      if (!result) return;

      if (result.status == 200) {
        this.button.loading = false;
        this.button.disabled = false;
        this.button.text = "Erfolgreich!";
        this.button.color = "success";
        this.button.icon = "mdi-check";
        setTimeout(() => {
          this.$router.push("/home");
        }, 1500);
      } else {
        if (result.status === 401) {
          this.error.message = "Sie sind nicht angemeldet!";
          this.button.color = "error";
          this.button.icon = "mdi-alert";
          this.button.text = "Login erforderlich";
          this.button.disabled = true;
          setTimeout(() => {
            this.$router.push("/");
          }, 1500);
        } else {
          this.error.message =
            "Eintrag fehlgeschlagen. Bitte versuchen Sie es erneut!";
          this.button.loading = false;
          this.button.disabled = false;
          this.button.text = "Hochladen";
          this.button.color = "error";
        }
        this.error.show = true;
      }
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <v-card>
      <v-card-title> Meine Veranstaltungen </v-card-title>
      <v-card-subtitle>
        Hier können Sie nachträglich Dateien zu Ihren Veranstaltungen hochladen
      </v-card-subtitle>
      <v-card-actions>
        <v-btn
          width="100%"
          @click="openDialog(index)"
          :key="index"
          v-for="(event, index) in events"
        >
          {{ event.name }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog">
      <v-form @submit.prevent="sendData()">
        <v-card>
          <v-card-title> Dateien </v-card-title>
          <v-card-subtitle
            >Optional Ablaufpläne, Präsentationen, etc.
            anhängen.</v-card-subtitle
          >
          <v-card-text>
            <v-file-input
              v-model="files"
              label="Dateien"
              multiple
              density="compact"
              chips
              outlined
              clearable
              show-size
              accept=".html, image/*, .zip, .pdf, .txt, .pptx, .csv, video/*, audio/*"
            ></v-file-input>
          </v-card-text>

          <v-alert
            color="error"
            v-if="error.show"
            :title="error.message"
          ></v-alert>
          <v-card-actions>
            <v-btn type="reset" variant="tonal">Zurücksetzen</v-btn>
            <v-btn
              type="submit"
              variant="tonal"
              :disabled="button.disabled"
              :loading="button.loading"
              :prepend-icon="button.icon"
              :color="button.color || undefined"
            >
              {{ button.text }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<style scoped>
.v-card-title {
  font-size: 1.5rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.v-card-subtitle {
  padding: 4px;
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
  font-size: 18px;
}

.v-form {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  height: 100%;
  padding-top: 40px;
  gap: 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 20px;
}

.v-card {
  width: 600px;
}

.v-card-actions {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 5px;
}

@media screen and (max-width: 900px) {
  .v-card {
    width: 80%;
  }
}

@media screen and (max-width: 600px) {
  .v-card-actions {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
  }
}
</style>
