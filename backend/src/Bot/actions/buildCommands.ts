import { SlashCommandBuilder } from 'discord.js'

export default [
  new SlashCommandBuilder().setName('userinfo')
    .setDescription('Die Kontaktinformationen eines Benutzers abrufen.')
    .addUserOption(option => option.setName('target').setDescription('Der Benutzer, dessen Kontaktinformationen abgerufen werden sollen.').setRequired(true)),
  new SlashCommandBuilder().setName('register')
    .setDescription('Dich als neuen Benutzer registrieren.')
    .addStringOption(option => option.setName('name').setDescription('Dein Name.').setRequired(true))
    .addStringOption(option => option.setName('contact').setDescription('Deine Kontaktinformationen.').setRequired(true)),
]
