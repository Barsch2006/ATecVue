<script lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

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
            viewingEvent: ref<IEvent>()
        }
    },
    methods: {
        openEvent(id: string) {
            console.log(id);
            this.viewingEvent = undefined;
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

                </v-card-title>
                <v-card-text>
                    <!-- todo -->
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="viewEvent = false">
                        Schließen
                    </v-btn>
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
