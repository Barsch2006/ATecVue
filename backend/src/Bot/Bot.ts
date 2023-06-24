import { ChannelType, Client, IntentsBitField } from 'discord.js';
import interactionCreate from './listeners/interactionCreate';
import registerCommands from './actions/registerCommands';
import { Db } from 'mongodb';

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

    async destroy() {
        this.client?.destroy();
    }
}

export default ATecBot;
