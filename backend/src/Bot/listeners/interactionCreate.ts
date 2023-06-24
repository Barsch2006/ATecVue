import userinfo from 'Bot/actions/userinfo'
import statistics from 'Bot/actions/statistics'

import {
    CommandInteraction, Client, Interaction,
    ButtonInteraction,
    TextChannel,
} from 'discord.js'
import { Db } from 'mongodb'

export default (client: Client, db: Db): void => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction, db)
        }
        if (interaction.isButton()) {
            await handleButtonInteraction(client, interaction, db)
        }
    })
}

const handleSlashCommand = async (client: Client, interaction: CommandInteraction, db: Db): Promise<void> => {
    switch (interaction.commandName) {
        case 'userinfo':
            await userinfo(client, interaction, db);
            break;
        case 'statistics':
            await statistics(client, interaction, db);
            break;
    }
}

const handleButtonInteraction = async (client: Client, interaction: ButtonInteraction, db: Db): Promise<void> => {
    if (interaction.customId === 'event-participate') {
        await newParticipant(client, interaction, db)
    }
}

async function newParticipant(client: Client<boolean>, interaction: ButtonInteraction, db: Db) {
    const event_id = interaction.message.id
    const event_obj = await db.collection('events').findOne({ message_id: event_id })
    if (!event_obj) {
        await interaction.reply({ content: 'Fehler. Event nicht gefunden.', ephemeral: true })
        return
    }
    // get the user by username
    const user = await db.collection('users').findOne({ username: interaction.user.username })

    // check if users id is in the participants list of the event
    if (event_obj.participants.includes(user?._id)) {
        await interaction.reply({ content: 'Mehrfaches übernehmen ist nicht möglich', ephemeral: true })
        return
    }
    await db.collection('event_participants').insertOne({ event_id: event_id, participant_id: interaction.user.id })
    await interaction.reply({ content: 'Du übernimmst diese Veranstaltung.', ephemeral: true })

    // update the Teilnehmer field of the event message. add the user to the list
    const channel = client.channels.cache.get(event_obj.channel_id) as TextChannel
    const message = await channel.messages.fetch(event_id)
    const participants = message.embeds[0].fields[2].value
    message.embeds[0].fields[10].value = `${participants}\n${interaction.user.username}`
}
