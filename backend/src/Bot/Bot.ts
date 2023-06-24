import { ChannelType, Client, Colors, EmbedBuilder, IntentsBitField } from 'discord.js';
import interactionCreate from './listeners/interactionCreate';
import registerCommands from './actions/registerCommands';
import { Db } from 'mongodb';
import IEvent from 'Event/event';

class ATecBot {
    private token: string;
    private applicationId: string;
    private client: Client;
    event_channel: string;
    default_channel: string;

    constructor(token: string, applicationId: string, db: Db, options: { default_channel: string, event_channel: string }) {
        this.default_channel = options.default_channel;
        this.event_channel = options.event_channel;
        this.token = token;
        this.applicationId = applicationId;
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
            ]
        });
        this.init(db);
    }

    async init(db: Db) {
        interactionCreate(this.client, db);
        registerCommands(this.client, this.token, this.applicationId);
        await this.client.login(this.token);
    }

    async sendStringMessage(message: string) {
        const channel = await this.client.channels.fetch(this.default_channel);
        if (!channel || channel.type !== ChannelType.GuildText) {
            throw new Error("Text-Channel not found!");
        }
        await channel.send(message);
    }

    async sendEventForm(event: IEvent) {
        const channel = await this.client.channels.fetch(this.event_channel);
        if (!channel || channel.type !== ChannelType.GuildText) {
            throw new Error("Text-Channel not found!");
        }
        await channel.send({
            embeds: [new EmbedBuilder().setTitle(event.name)
                .setDescription(event.description)
                .addFields([
                    {
                        name: "Datum",
                        value: event.date,
                        inline: true
                    },
                    {
                        name: "Uhrzeit",
                        value: `${event.start} - ${event.end}`,
                        inline: true
                    },
                    {
                        name: "Ort",
                        value: event.location,
                        inline: true
                    },
                    {
                        name: "Mikrofone",
                        value: event.microphones,
                        inline: true
                    },
                    {
                        name: "Headsets",
                        value: event.headsets,
                        inline: true
                    },
                    {
                        name: "Beamer",
                        value: event.beamer ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "HDMI",
                        value: event.hdmi ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "VGA",
                        value: event.vga ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "USB",
                        value: event.usb ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "Notizen",
                        value: event.notes || "Keine",
                        inline: true
                    }
                ])
                .setColor(Colors.DarkNavy)
                .setURL(`localhost:1337/event/${event._id}}`)
                .setTimestamp()
            ]
        });
    }

    async destroy() {
        this.client?.destroy();
    }
}

export default ATecBot;
