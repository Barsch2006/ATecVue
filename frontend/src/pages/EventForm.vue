<script lang="ts">
export default {
  mounted() {
    // Retrieve cached form data from browser storage
    const cachedData = JSON.parse(localStorage.getItem("formCache") || "{}");
    this.name = cachedData.name || "";
    this.lastname = cachedData.lastname || "";
    this.position = cachedData.position || "";
    this.email = cachedData.email || "";
    this.title = cachedData.title || "";
    this.description = cachedData.description || "";
    this.targetgroup = cachedData.targetgroup || "";
    this.date = cachedData.date || "";
    this.start = cachedData.start || "";
    this.end = cachedData.end || "";
    this.location = cachedData.location || "";
    this.notes = cachedData.notes || "";
    this.microphones = cachedData.microphones || 0;
    this.headsets = cachedData.headsets || 0;
    this.beamer = cachedData.beamer || false;
    this.hdmi = cachedData.hdmi || false;
    this.vga = cachedData.vga || false;
    this.usb = cachedData.usb || false;
  },
  data() {
    return {
      rules: {
        required: (value: string) => !!value || "Dieses Feld ist erforderlich.",
        email: (value: string) => {
          const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          return (
            pattern.test(value) ||
            "Bitte geben Sie eine gültige E-Mail-Adresse ein."
          );
        },
      },
      microphones: 0,
      headsets: 0,
      name: "",
      lastname: "",
      position: "",
      email: "",
      title: "",
      description: "",
      targetgroup: "",
      date: "",
      start: "",
      end: "",
      location: "",
      notes: "",
      beamer: false,
      hdmi: false,
      vga: false,
      usb: false,
      error: {
        show: false,
        message: "",
      },
      button: {
        disabled: false,
        loading: false,
        text: "Absenden",
        icon: "mdi-send",
        color: "",
        allowSend: true,
      },
      files: [],
    };
  },
  methods: {
    cacheFormInput() {
      // Cache form data in browser storage
      localStorage.setItem(
        "formCache",
        JSON.stringify({
          microphones: this.microphones,
          headsets: this.headsets,
          name: this.name,
          lastname: this.lastname,
          position: this.position,
          email: this.email,
          title: this.title,
          description: this.description,
          targetgroup: this.targetgroup,
          date: this.date,
          start: this.start,
          end: this.end,
          location: this.location,
          notes: this.notes,
          beamer: this.beamer,
          hdmi: this.hdmi,
          vga: this.vga,
          usb: this.usb,
        })
      );
    },
    async sendData() {
      if (!this.button.allowSend) return;
      this.button.allowSend = false;
      this.button.loading = true;
      const data = {
        microphones: this.microphones,
        headsets: this.headsets,
        name: this.name,
        lastname: this.lastname,
        position: this.position,
        email: this.email,
        title: this.title,
        description: this.description,
        targetgroup: this.targetgroup,
        start: new Date(`${this.date} ${this.start}`).getTime() / 1000,
        end: new Date(`${this.date} ${this.end}`).getTime() / 1000,
        location: this.location,
        notes: this.notes || undefined,
        beamer: this.beamer,
        hdmi: this.hdmi,
        vga: this.vga,
        usb: this.usb,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      this.files.forEach((file) => {
        formData.append("files", file);
      });

      const result = await fetch("/event", {
        method: "post",
        body: formData,
      }).catch(() => {
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
          this.button.disabled = false;
          setTimeout(() => {
            this.$router.push("/");
          }, 1500);
        } else {
          this.button.allowSend = true;
        }
        this.error.show = true;
        this.button.loading = false;
      } else {
        // clear all fields in cache
        localStorage.setItem("formCache", JSON.stringify({}));
        this.button.loading = false;
        this.button.disabled = false;
        this.button.text = "Erfolgreich!";
        this.button.color = "success";
        this.button.icon = "mdi-check";
        setTimeout(() => {
          this.$router.push("/home");
        }, 1500);
      }
    },
  },
};
</script>

<template>
  <v-form @submit.prevent="sendData()">
    <v-card>
      <v-card-title> Angaben über den Veranstalter </v-card-title>
      <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
      <v-card-text>
        <v-text-field
          @update:model-value="cacheFormInput()"
          v-model="name"
          clearable
          label="Vorname"
          density="compact"
          :rules="[rules.required]"
        />
        <v-text-field
          @update:model-value="cacheFormInput()"
          v-model="lastname"
          clearable
          label="Nachname"
          density="compact"
          :rules="[rules.required]"
        />
        <v-text-field
          @update:model-value="cacheFormInput()"
          v-model="position"
          clearable
          label="Position in der Schule"
          density="compact"
          :rules="[rules.required]"
        />
        <v-text-field
          @update:model-value="cacheFormInput()"
          v-model="email"
          type="email"
          clearable
          label="E-Mail"
          density="compact"
          :rules="[rules.required, rules.email]"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Veranstaltung </v-card-title>
      <v-card-text>
        <v-text-field
          @update:model-value="cacheFormInput()"
          v-model="title"
          clearable
          label="Titel der Veranstaltung"
          density="compact"
          :rules="[rules.required]"
        />
        <v-textarea
          @update:model-value="cacheFormInput()"
          v-model="description"
          clearable
          label="Beschreibung"
          :rules="[rules.required]"
        />
        <v-text-field
          @update:model-value="cacheFormInput()"
          v-model="targetgroup"
          clearable
          label="Zielgruppe"
          density="compact"
          :rules="[rules.required]"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Zeitpunkt </v-card-title>
      <v-card-text>
        <v-text-field
          @update:model-value="cacheFormInput()"
          v-model="date"
          clearable
          label="Datum"
          density="compact"
          :rules="[rules.required]"
          type="date"
        />
        <v-text-field
          @update:model-value="cacheFormInput()"
          v-model="start"
          clearable
          label="Start"
          density="compact"
          :rules="[rules.required]"
          type="time"
        />
        <v-text-field
          @update:model-value="cacheFormInput()"
          v-model="end"
          clearable
          label="Vorraussichtliches Ende"
          density="compact"
          :rules="[rules.required]"
          type="time"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Veranstaltungsort </v-card-title>
      <v-card-text>
        <v-select
          @update:model-value="cacheFormInput()"
          v-model="location"
          :items="['Aula', 'Sporthalle', 'Sportplatz']"
          :rules="[rules.required]"
          clearable
          label="Veranstaltungsort"
          density="compact"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Materialien </v-card-title>
      <v-card-text>
        <v-slider
          @update:model-value="cacheFormInput()"
          v-model="microphones"
          :label="`Handmikrofone (${microphones})`"
          :max="10"
          :min="0"
          :step="1"
          ticks="1"
        />
        <v-slider
          @update:model-value="cacheFormInput()"
          v-model="headsets"
          :label="`Headsets (${headsets})`"
          :max="5"
          :min="0"
          :step="1"
          ticks="1"
        />
        <v-checkbox
          @update:model-value="cacheFormInput()"
          v-model="beamer"
          label="Beamer"
        ></v-checkbox>
        <v-checkbox
          @update:model-value="cacheFormInput()"
          :disabled="!beamer"
          v-model="hdmi"
          label="Mein Laptop hat einen HDMI Anschluss"
        ></v-checkbox>
        <v-checkbox
          @update:model-value="cacheFormInput()"
          :disabled="!beamer"
          v-model="vga"
          label="Mein Laptop hat einen VGA Anschluss"
        ></v-checkbox>
        <v-checkbox
          @update:model-value="cacheFormInput()"
          :disabled="!beamer"
          v-model="usb"
          label="Ich habe einen USB-Stick oder in der Cloud"
        ></v-checkbox>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Dateien </v-card-title>
      <v-card-subtitle
        >Optional Ablaufpläne, Präsentationen, etc. anhängen</v-card-subtitle
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
    </v-card>

    <v-card>
      <v-card-title> Schluss </v-card-title>
      <v-card-text>
        <v-textarea
          @update:model-value="cacheFormInput()"
          name="notes"
          clearable
          label="Sonstiges, Anmerkungen, Generalprobe.."
          v-model="notes"
        />
      </v-card-text>
      <v-alert color="error" v-if="error.show" :title="error.message"></v-alert>
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
