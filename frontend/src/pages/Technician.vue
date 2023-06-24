<script lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { loadConfigFromFile } from 'vite';

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
}

export default {
    components: {
        FullCalendar
    },
    data() {
        return {
            events: Array<{
                id: string;
                title: string;
                date: string;
                start: string;
                end: string;
                location: string;
                description: string;
                notes: string;
            }>(
                {
                    id: '0',
                    title: 'Test',
                    date: '2023-06-24',
                    start: '12:00',
                    end: '13:00',
                    location: 'Aula',
                    description: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima repellat nostrum suscipit, alias atque sint recusandae hic odio, non beatae consectetur sapiente dicta quo numquam debitis dolores aperiam quam totam veniam autem repellendus tempore. Ratione quia laudantium quae soluta. Quisquam velit fuga, modi rem distinctio illo saepe? Numquam ratione quas sapiente mollitia deserunt at iste, aspernatur qui accusantium enim dolore eum? Provident quas, enim cupiditate necessitatibus ea temporibus alias eveniet. Ipsum excepturi dolorum officia, obcaecati tempore iure doloremque mollitia cupiditate eligendi a officiis qui incidunt possimus, aut assumenda maxime perspiciatis sunt voluptatem neque enim! Officiis fugit aut eum nam ipsam?`,
                    notes: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima repellat nostrum suscipit, alias atque sint recusandae hic odio, non beatae consectetur sapiente dicta quo numquam debitis dolores aperiam quam totam veniam autem repellendus tempore. Ratione quia laudantium quae soluta. Quisquam velit fuga, modi rem distinctio illo saepe? Numquam ratione quas sapiente mollitia deserunt at iste, aspernatur qui accusantium enim dolore eum? Provident quas, enim cupiditate necessitatibus ea temporibus alias eveniet. Ipsum excepturi dolorum officia, obcaecati tempore iure doloremque mollitia cupiditate eligendi a officiis qui incidunt possimus, aut assumenda maxime perspiciatis sunt voluptatem neque enim! Officiis fugit aut eum nam ipsam?`,
                }
            ),
            viewEvent: false,
            viewingEvent: ref<IEvent>(),

            name: '',
            lastname: '',
            email: '',
            position: '',
            title: '',
            description: '',
            targetgroup: '',
            date: '',
            start: '',
            end: '',
            location: '',
            beamer: false,
            hdmi: false,
            vga: false,
            usb: false,
            microphones: '0',
            headsets: '0',
            notes: '',
        }
    },
    methods: {
        openEvent(id: string) {
            console.log(id);
            this.viewingEvent = {
                _id: '0',
                name: 'Christian',
                lastname: 'Fuchte',
                email: 'christian0511@gmx.de',
                position: 'SV',
                title: 'VV',
                description: 'Vollversammlung',
                targetgroup: 'Schüler',
                date: '2021-06-24',
                start: '12:00',
                end: '13:00',
                location: 'Aula',
                beamer: true,
                hdmi: true,
                vga: false,
                usb: false,
                microphones: '2',
                headsets: '0',
                notes: 'keine Generalprobe; eigene Techniker',
            };
            this.name = this.viewingEvent?.name ?? '';
            this.lastname = this.viewingEvent?.lastname ?? '';
            this.email = this.viewingEvent?.email ?? '';
            this.position = this.viewingEvent?.position ?? '';
            this.title = this.viewingEvent?.title ?? '';
            this.description = this.viewingEvent?.description ?? '';
            this.targetgroup = this.viewingEvent?.targetgroup ?? '';
            this.date = this.viewingEvent?.date ?? '';
            this.start = this.viewingEvent?.start ?? '';
            this.end = this.viewingEvent?.end ?? '';
            this.location = this.viewingEvent?.location ?? '';
            this.beamer = this.viewingEvent?.beamer ?? false;
            this.hdmi = this.viewingEvent?.hdmi ?? false;
            this.vga = this.viewingEvent?.vga ?? false;
            this.usb = this.viewingEvent?.usb ?? false;
            this.microphones = this.viewingEvent?.microphones ?? '0';
            this.headsets = this.viewingEvent?.headsets ?? '0';
            this.notes = this.viewingEvent?.notes ?? '';

            this.viewEvent = true
        },
    },
    computed: {
        fullCalenderOptions() {
            return {
                plugins: [dayGridPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                events: this.events.map((event: any) => {
                    return {
                        id: event.id,
                        title: event.title,
                        date: event.date
                    }
                }),
                eventClick: (info: any) => {
                    this.openEvent(info.event.id);
                },
                height: '60vh',
            };
        }
    },
}
</script>

<template>
    <div>
        <FullCalendar :options="fullCalenderOptions" />

        <v-table style="margin-top: 40px;" fixed-header>
            <thead>
                <tr>
                    <th class="text-left">
                        ID
                    </th>
                    <th class="text-left">
                        Titel
                    </th>
                    <th class="text-left">
                        Datum
                    </th>
                    <th class="text-left">
                        Start
                    </th>
                    <th class="text-left">
                        Ende
                    </th>
                    <th class="text-left">
                        Ort
                    </th>
                    <th class="text-left">
                        Beschreibung
                    </th>
                    <th class="text-left">
                        Notizen
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr @click="openEvent(item.id)" v-for="item in events" :key="item.id">
                    <td>
                        {{ item.id }}
                    </td>
                    <td>
                        {{ item.title }}
                    </td>
                    <td>
                        {{ item.date }}
                    </td>
                    <td>
                        {{ item.start }}
                    </td>
                    <td>
                        {{ item.end }}
                    </td>
                    <td>
                        {{ item.location }}
                    </td>
                    <td class="wrap-text">
                        {{ item.description.slice(0, 200) + '...' }}
                    </td>
                    <td class="wrap-text">
                        {{ item.notes.slice(0, 200) + '...' }}
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-dialog v-model="viewEvent">
            <v-card>
                <v-card-title>
                    Angaben über den Veranstalter
                </v-card-title>
                <v-card-text>
                    <v-text-field readonly v-model="name" label="Vorname" density="compact" />
                    <v-text-field readonly v-model="lastname" label="Nachname" density="compact" />
                    <v-text-field readonly v-model="position" label="Position in der Schule" density="compact" />
                    <v-text-field readonly v-model="email" type="email" label="E-Mail" density="compact" />
                </v-card-text>

                <v-card-title>
                    Veranstaltung
                </v-card-title>
                <v-card-text>
                    <v-text-field readonly v-model="title" label="Titel der Veranstaltung" density="compact" />
                    <v-textarea readonly v-model="description" label="Beschreibung" />
                    <v-text-field readonly v-model="targetgroup" label="Zielgruppe" density="compact" />
                </v-card-text>

                <v-card-title>
                    Zeitpunkt
                </v-card-title>
                <v-card-text>
                    <v-text-field readonly v-model="date" label="Datum" density="compact" type="date" />
                    <v-text-field readonly v-model="start" label="Start" density="compact" type="time" />
                    <v-text-field readonly v-model="end" label="Vorraussichtliches Ende" density="compact" type="time" />
                </v-card-text>

                <v-card-title>
                    Veranstaltungsort
                </v-card-title>
                <v-card-text>
                    <v-select readonly v-model="location" label="Veranstaltungsort" density="compact" />
                </v-card-text>

                <v-card-title>
                    Materialien
                </v-card-title>
                <v-card-text>
                    <v-slider readonly v-model="microphones" :label="`Handmikrofone (${microphones})`" :max="10"
                        :min="0" :step="1" ticks="1" />
                    <v-slider readonly v-model="headsets" :label="`Headsets (${headsets})`" :max="10" :min="0"
                        :step="1" ticks="1" />
                    <v-checkbox readonly v-model="beamer" label="Beamer"></v-checkbox>
                    <v-checkbox readonly v-model="hdmi" label="Mein Laptop hat einen HDMI Anschluss"></v-checkbox>
                    <v-checkbox readonly v-model="vga" label="Mein Laptop hat einen VGA Anschluss"></v-checkbox>
                    <v-checkbox readonly v-model="usb" label="Ich habe einen USB-Stick oder in der Cloud"></v-checkbox>
                </v-card-text>

                <v-card-title>
                    Schluss
                </v-card-title>
                <v-card-text>
                    <v-textarea readonly v-model="notes" clearable label="Sonstiges, Anmerkungen, Generalprobe.." />
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="viewEvent = false" variant="tonal" width="100%">Schließen</v-btn>
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
