import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, IntentsBitField } from 'discord.js';
import interactionCreate from './listeners/interactionCreate';
import registerCommands from './actions/registerCommands';
import { Db, WithId } from 'mongodb';
import IEvent from './../Event/event';
import buildEventEmbed from './Embeds/buildEventEmbed';

class ATecBot extends Client {
    private applicationId: string;
    event_channel: string;
    default_channel: string;
    db: Db;

    constructor(token: string, applicationId: string, db: Db, options: { default_channel: string, event_channel: string }) {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
            ]
        })
        this.default_channel = options.default_channel;
        this.event_channel = options.event_channel;
        this.applicationId = applicationId;
        this.db = db;
        this.login(token).then(() => {
            console.info("INFO", "Discord Bot is ready!");
        });
        interactionCreate(this, this.db);
        registerCommands(this, token, this.applicationId);
    }

    async sendStringMessage(message: string) {
        const channel = await this.channels.fetch(this.default_channel);
        if (!channel || channel.type !== ChannelType.GuildText) {
            throw new Error("Text-Channel not found!");
        }
        await channel.send(message);
    }

    async sendEventForm(event: WithId<IEvent>) {
        const channel = await this.channels.fetch(this.event_channel);
        if (!channel || channel.type !== ChannelType.GuildText) {
            throw new Error("Text-Channel not found!");
        }
        const message = await channel.send({
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel("Übernehmen")
                        .setEmoji('🛠️')
                        .setCustomId('event-participate')
                        .setStyle(ButtonStyle.Primary),
                    // update button
                    new ButtonBuilder()
                        .setEmoji('🔄')
                        .setCustomId('event-update')
                        .setStyle(ButtonStyle.Secondary),
                )
            ],
            embeds: [
                await buildEventEmbed(this, event, this.db)
            ]
        });
        return message.id;
    }
}

export default ATecBot;
