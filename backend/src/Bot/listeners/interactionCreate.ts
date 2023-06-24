import userinfo from '../actions/userinfo'

import {
    CommandInteraction, Client, Interaction,
    ButtonInteraction,
} from 'discord.js'
import { Db } from 'mongodb'
import IEvent from '../../Event/event'
import IUser from '../../Auth/user'
import buildEventEmbed from '../Embeds/buildEventEmbed'

export default (client: Client, db: Db): void => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await handleSlashCommand(interaction, db)
        }
        if (interaction.isButton()) {
            await handleButtonInteraction(interaction, db)
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

const handleButtonInteraction = async (interaction: ButtonInteraction, db: Db): Promise<void> => {
    if (interaction.customId === 'event-participate') {
        await newParticipant(interaction, db)
    }
}

async function newParticipant(interaction: ButtonInteraction, db: Db) {
    const event_id = interaction.message.id
    const event_obj = await db.collection<IEvent>('events').findOne({ discordMessageId: event_id })
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
    if (event_obj.participants.includes(user?._id)) {
        await interaction.reply({ content: 'Du übernimmst diese Veranstaltung bereits', ephemeral: true })
        return;
    }
    await db.collection('event_participants').insertOne({ event_id: event_id, participant_id: interaction.user.id })
    await interaction.reply({ content: 'Du wurdest in die Veranstaltung eingetragen', ephemeral: true })

    // update the event message
    if (interaction.message.editable) {
        interaction.message.edit({
            embeds: [
                await buildEventEmbed(event_obj, db)
            ]
        })
    }
}
