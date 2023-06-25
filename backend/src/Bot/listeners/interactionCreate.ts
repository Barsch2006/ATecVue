import userinfo from '../actions/userinfo'

import {
    CommandInteraction, Client, Interaction,
    ButtonInteraction,
    ActionRowBuilder,
    ButtonStyle,
} from 'discord.js'
import { Db } from 'mongodb'
import IEvent from '../../Event/event'
import IUser from '../../Auth/user'
import buildEventEmbed from '../Embeds/buildEventEmbed'
import { ButtonBuilder } from '@discordjs/builders'

export default (client: Client, db: Db): void => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await handleSlashCommand(interaction, db)
        }
        if (interaction.isButton()) {
            await handleButtonInteraction(client, interaction, db)
        }
    })
}

const handleSlashCommand = async (interaction: CommandInteraction, db: Db): Promise<void> => {
    switch (interaction.commandName) {
        case 'userinfo':
            await userinfo(interaction, db);
            break;
    }
}

const handleButtonInteraction = async (client: Client, interaction: ButtonInteraction, db: Db): Promise<void> => {
    if (interaction.customId === 'event-participate') {
        await newParticipant(client, interaction, db)
    }
}

async function newParticipant(client: Client, interaction: ButtonInteraction, db: Db) {
    const event_id = interaction.message.id
    const event_obj = await db.collection<IEvent>('events').findOne({ discordMessageId: { $eq: event_id } })
    if (!event_obj) {
        await interaction.reply({ content: 'Fehler. Event nicht gefunden.', ephemeral: true })
        return
    }
    // get the user by username
    const user = await db.collection<IUser>('users').findOne({ dId: interaction.user.id })

    if (!user) {
        await interaction.reply({ content: 'Fehler. User nicht gefunden.', ephemeral: true })
        return
    }

    event_obj.participants = event_obj.participants ?? [];

    // check if users id is in the participants list of the event
    if (event_obj.participants.some((id) => id.equals(user._id))) {
        await interaction.reply({ content: 'Du übernimmst diese Veranstaltung bereits', ephemeral: true })
        return;
    }
    await db.collection<IEvent>('events').updateOne({ _id: event_obj._id }, {
        $push: {
            participants: user._id
        }
    })
    await interaction.reply({ content: 'Du wurdest in die Veranstaltung eingetragen', ephemeral: true })

    // update the event message
    if (interaction.message.editable) {
        await interaction.message.edit({
            embeds: [
                await buildEventEmbed(client, event_obj, db)
            ]
        })
    }
}


async function updateEventMessage(interaction: ButtonInteraction, db: Db) {
    const messageId = interaction.message.id;
    const event = await db.collection<IEvent>('events').findOne({ discordMessageId: { $eq: messageId } });
    if (!event) {
        await interaction.reply({ content: 'Fehler. Event nicht gefunden.', ephemeral: true })
        return
    }
    if (interaction.message.editable) {
        await interaction.message.edit({
            embeds: [
                await buildEventEmbed(interaction.client, event, db)
            ]
        })
    } else {
        await interaction.reply({ content: 'Fehler. Event Nachricht nicht editierbar.', ephemeral: true })
    }
}

async function deleteEventMessage(interaction: ButtonInteraction, db: Db) {

    // check if user is admin
    const user = await db.collection<IUser>('users').findOne({ dId: interaction.user.id })
    if (!user) {
        await interaction.reply({ content: 'Fehler. User nicht gefunden.', ephemeral: true })
        return
    }
    if (user.permissionLevel !== "admin") {
        await interaction.reply({ content: 'Fehler: Dir fehlt die Berechtigung', ephemeral: true })
        return
    }

    if (!interaction.message.deletable) {
        await interaction.reply({ content: 'Fehler. Event Nachricht nicht löschbar.', ephemeral: true })
        return
    }

    // confirm message
    const confirmMessage = await interaction.reply({
        content: 'Bist du sicher, dass du diese Veranstaltung löschen möchtest? (Button funktionier 10s lang)', ephemeral: true, components: [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('event-delete-confirm')
                        .setLabel('Ja')
                        .setStyle(ButtonStyle.Danger),
                ),
        ]
    })

    // wait for confirmation
    const filter = (i: Interaction) => {
        if (!i.isButton()) return false;
        return i.message.id === confirmMessage.id;
    };
    const collector = interaction.channel?.createMessageComponentCollector({
        filter,
        time: 10_000
    });

    collector?.on("collect", (i) => {
        if (!i.isButton()) return;
        if (i.message.id !== confirmMessage.id) return;
        if (i.customId === "event-delete-confirm" && interaction.message.deletable) {
            interaction.message.delete();
            confirmMessage.delete();
            collector.stop();
            return;
        }
        if (!interaction.message.deletable) {
            i.reply({ content: 'Fehler. Event Nachricht nicht löschbar.', ephemeral: true });
            confirmMessage.delete();
            collector.stop();
            return;
        }
        if (interaction.customId === "event-delete-cancel") {
            i.reply({ content: 'Löschen abgebrochen', ephemeral: true });
            confirmMessage.delete();
            collector.stop();
            return;
        }
    })

    collector?.on("end", () => {
        confirmMessage.delete();
    });


}