import { SlashCommandBuilder } from 'discord.js'

export default [
  new SlashCommandBuilder().setName('event')
    .setDescription('Neues Event erstellen')
    .addStringOption(
      o => o.setName('organizer')
        .setDescription('Name des Organisators')
        .setRequired(true)
    )
    .addStringOption(
      o => o.setName('name')
        .setDescription('Titel des Events')
        .setRequired(true)
    )
    .addStringOption(
      o => o.setName('description')
        .setDescription('Beschreibung des Events')
        .setRequired(true)
    )
    .addStringOption(
      o => o.setName('date')
        .setDescription('Datum des Events')
        .setRequired(true)
    )
    .addStringOption(
      o => o.setName('time')
        .setDescription('Uhrzeit des Events')
        .setRequired(true)
    )
    .addStringOption(
      o => o.setName('location')
        .setDescription('Ort des Events')
        .setRequired(true)
    )
]
