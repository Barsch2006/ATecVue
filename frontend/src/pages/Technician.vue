<script lang="ts">
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface IEvent {
  // event id
  _id?: string;
  // creator info
  name: string;
  lastname: string;
  email: string;
  position: string;
  // event info
  title: string;
  description: string;
  targetgroup: string;
  date: string;
  start: string;
  end: string;
  location: string;
  // material info
  microphones: string;
  headsets: string;
  beamer: boolean;
  hdmi: boolean;
  vga: boolean;
  usb: boolean;
  // special info
  notes?: string;

  // backend info
  discordMessageId?: string;
  participantIds?: string[]; // the mongodb ids of the participants

  // files
  files: Array<{ id: string; filename: string }>;
}

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      isAdmin: document.cookie.includes("usertype=admin"),
      events: Array<{
        _id: string;
        title: string;
        date: string;
        start: string;
        end: string;
        location: string;
      }>(),
      viewEvent: false,
      viewingEvent: ref<IEvent>(),

      name: "",
      lastname: "",
      email: "",
      position: "",
      title: "",
      description: "",
      targetgroup: "",
      date: "",
      start: "",
      end: "",
      location: "",
      beamer: false,
      hdmi: false,
      vga: false,
      usb: false,
      microphones: "0",
      headsets: "0",
      notes: String() || null,
      files: Array<{ id: string; filename: string }>(),
      error: {
        show: false,
        message: "",
      },
      loadingEvent: false,
      copyColor: "",
    };
  },
  beforeMount() {
    fetch("/events", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          this.$router.push("/");
          return;
        }

        response.json().then((data) => {
          this.events = data;
          // modify data so start and end (UTC) are converted to local time
          this.events.forEach((event) => {
            event.date = new Date(parseInt(event.start) * 1000)
              .toISOString()
              .split("T")[0];
            event.start = new Date(parseInt(event.start) * 1000)
              .toLocaleTimeString()
              .split(":")
              .slice(0, -1)
              .join(":");
            event.end = new Date(parseInt(event.end) * 1000)
              .toLocaleTimeString()
              .split(":")
              .slice(0, -1)
              .join(":");
            console.log(event.start + " | " + event.end + " | " + event.date);
          });
        });
      })
      .catch((err) => {
        this.error.show = true;
        this.error.message = err;
      });
  },
  mounted() {
    if (window.location.hash) {
      // get the hash
      const hash = window.location.hash.substring(1);
      // open the event
      this.openEvent(hash);
    }
  },
  methods: {
    openEvent(id: string) {
      this.loadingEvent = true;
      fetch(`/event/${id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          response.json().then((data) => {
            this.loadingEvent = false;
            this.viewingEvent = data;
            this.name = this.viewingEvent?.name ?? "";
            this.lastname = this.viewingEvent?.lastname ?? "";
            this.email = this.viewingEvent?.email ?? "";
            this.position = this.viewingEvent?.position ?? "";
            this.title = this.viewingEvent?.title ?? "";
            this.description = this.viewingEvent?.description ?? "";
            this.targetgroup = this.viewingEvent?.targetgroup ?? "";
            this.date = new Date(
              parseInt(this.viewingEvent?.start ?? "") * 1000
            )
              .toISOString()
              .split("T")[0];
            this.start = new Date(
              parseInt(this.viewingEvent?.start ?? "") * 1000
            )
              .toLocaleTimeString()
              .split(":")
              .slice(0, -1)
              .join(":");
            this.end = new Date(parseInt(this.viewingEvent?.end ?? "") * 1000)
              .toLocaleTimeString()
              .split(":")
              .slice(0, -1)
              .join(":");
            this.location = this.viewingEvent?.location ?? "";
            this.beamer = this.viewingEvent?.beamer ?? false;
            this.hdmi = this.viewingEvent?.hdmi ?? false;
            this.vga = this.viewingEvent?.vga ?? false;
            this.usb = this.viewingEvent?.usb ?? false;
            this.microphones = this.viewingEvent?.microphones ?? "0";
            this.headsets = this.viewingEvent?.headsets ?? "0";
            this.notes = this.viewingEvent?.notes ?? "";
            this.files =
              this.viewingEvent?.files ??
              Array<{
                id: string;
                filename: string;
              }>();
            this.viewEvent = true;
          });
        })
        .catch((err) => {
          this.loadingEvent = false;
          this.error.show = true;
          this.error.message = err;
        });
    },
    deleteEvent() {
      fetch(`/event/${this.viewingEvent?._id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            this.viewEvent = false;
            this.$router.push("/technician");
          } else {
            this.error.show = true;
            this.error.message = "Fehler beim Löschen des Events";
          }
        })
        .catch((err) => {
          this.error.show = true;
          this.error.message = err;
        });
    },
    copyUrl() {
      try {
        navigator.clipboard.writeText(
          "https://atec.heeecker.me/technician#" + this.viewingEvent?._id
        );
        this.copyColor = "success";
      } catch (err) {
        this.copyColor = "error";
      }
    },
  },
  computed: {
    fullCalenderOptions() {
      return {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        events: this.events.map((event: any) => {
          return {
            title: event.title,
            date: event.date,
            extendedProps: {
              objectId: event._id,
            },
          };
        }),
        eventClick: (info: any) => {
          const objectId = info.event.extendedProps.objectId;
          this.openEvent(objectId);
        },
        height: "80vh",
      };
    },
  },
};
</script>

<template>
  <div>
    <v-progress-circular
      v-if="loadingEvent"
      style="
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        top: 100px;
        z-index: 20;
      "
      indeterminate
    ></v-progress-circular>
    <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>
    <FullCalendar :options="fullCalenderOptions" />

    <v-table style="margin-top: 40px" fixed-header>
      <thead>
        <tr>
          <th class="text-left">Titel</th>
          <th class="text-left">Datum</th>
          <th class="text-left">Start</th>
          <th class="text-left">Ende</th>
          <th class="text-left">Ort</th>
        </tr>
      </thead>
      <tbody>
        <tr @click="openEvent(item._id)" v-for="item in events" :key="item._id">
          <td>
            {{ item.title }}
          </td>
          <td class="copy">
            {{ item.date }}
          </td>
          <td class="copy">
            {{ item.start }}
          </td>
          <td class="copy">
            {{ item.end }}
          </td>
          <td>
            {{ item.location }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="viewEvent">
      <v-card>
        <v-card-title
          style="
            width: 100%;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          "
        >
          <v-btn
            variant="tonal"
            @click="copyUrl()"
            icon="mdi-share"
            elevation="0"
            rounded
            :color="copyColor"
          ></v-btn>
          Veranstaltungs Details
        </v-card-title>
        <v-alert
          v-if="error.show"
          color="error"
          :title="error.message"
        ></v-alert>
        <v-card-title> Angaben über den Veranstalter</v-card-title>
        <v-card-text>
          <v-text-field
            readonly
            v-model="name"
            label="Vorname"
            density="compact"
          />
          <v-text-field
            readonly
            v-model="lastname"
            label="Nachname"
            density="compact"
          />
          <v-text-field
            readonly
            v-model="position"
            label="Position in der Schule"
            density="compact"
          />
          <v-text-field
            readonly
            v-model="email"
            type="email"
            label="E-Mail"
            density="compact"
          />
        </v-card-text>

        <v-card-title> Veranstaltung </v-card-title>
        <v-card-text>
          <v-text-field
            readonly
            v-model="title"
            label="Titel der Veranstaltung"
            density="compact"
          />
          <v-textarea readonly v-model="description" label="Beschreibung" />
          <v-text-field
            readonly
            v-model="targetgroup"
            label="Zielgruppe"
            density="compact"
          />
        </v-card-text>

        <v-card-title> Zeitpunkt </v-card-title>
        <v-card-text>
          <v-text-field
            readonly
            v-model="date"
            label="Datum"
            density="compact"
          />
          <v-text-field
            readonly
            v-model="start"
            label="Start"
            density="compact"
          />
          <v-text-field
            readonly
            v-model="end"
            label="Vorraussichtliches Ende"
            density="compact"
          />
        </v-card-text>

        <v-card-title> Veranstaltungsort </v-card-title>
        <v-card-text>
          <v-select
            readonly
            v-model="location"
            label="Veranstaltungsort"
            density="compact"
          />
        </v-card-text>

        <v-card-title> Materialien </v-card-title>
        <v-card-text>
          <v-slider
            readonly
            v-model="microphones"
            :label="`Handmikrofone (${microphones})`"
            :max="10"
            :min="0"
            :step="1"
            ticks="1"
          />
          <v-slider
            readonly
            v-model="headsets"
            :label="`Headsets (${headsets})`"
            :max="10"
            :min="0"
            :step="1"
            ticks="1"
          />
          <v-checkbox readonly v-model="beamer" label="Beamer"></v-checkbox>
          <v-checkbox
            readonly
            v-model="hdmi"
            label="Mein Laptop hat einen HDMI Anschluss"
          ></v-checkbox>
          <v-checkbox
            readonly
            v-model="vga"
            label="Mein Laptop hat einen VGA Anschluss"
          ></v-checkbox>
          <v-checkbox
            readonly
            v-model="usb"
            label="Ich habe einen USB-Stick oder in der Cloud"
          ></v-checkbox>
        </v-card-text>

        <v-card-title> Dateien </v-card-title>
        <v-card-text v-if="files.length > 0">
          <v-btn
            style="margin-left: 5px; margin-bottom: 10px; margin-right: 5px"
            v-for="(file, index) in files"
            :key="index"
            variant="tonal"
          >
            <a style="color: #fff" :href="`/event/files/${file.id}`" download>{{
              file.filename
            }}</a>
          </v-btn>
        </v-card-text>
        <v-card-text v-else>
          <v-alert dense type="info" color="surface"
            >Keine Dateien hochgeladen</v-alert
          >
        </v-card-text>

        <v-card-title> Schluss </v-card-title>
        <v-card-text>
          <v-textarea
            readonly
            v-model="notes"
            clearable
            label="Sonstiges, Anmerkungen, Generalprobe.."
          />
        </v-card-text>

        <v-card-actions v-if="isAdmin">
          <v-btn @click="deleteEvent()" variant="tonal" width="100%"
            >Event Löschen</v-btn
          >
        </v-card-actions>
        <v-card-actions>
          <v-btn @click="viewEvent = false" variant="tonal" width="100%"
            >Schließen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.wrap-text {
  max-width: 150px;
  word-wrap: break-word;
  white-space: normal !important;
  overflow-wrap: break-word !important;
}
</style>
