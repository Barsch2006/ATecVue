import { SlashCommandBuilder } from 'discord.js'

export default [
  new SlashCommandBuilder().setName('userinfo')
    .setDescription('Die Kontaktinformationen eines Benutzers abrufen.')
    .addUserOption(option => option.setName('target').setDescription('Der Benutzer, dessen Kontaktinformationen abgerufen werden sollen.').setRequired(true)),
  new SlashCommandBuilder().setName('statistics')
    .setDescription('Statistiken über die ATec abrufen.')
    .addUserOption(option => option.setName('target').setDescription('Statistiken von einem Benutzer anzeigen').setRequired(false)),
]
