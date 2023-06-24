import { Routes, Client } from 'discord.js'
import { REST } from '@discordjs/rest'
import CommandList from './buildCommands'

export default (client: Client, token: string, applicationId: string): void => {
  const rest = new (REST)({ version: '10' }).setToken(token)

  client.once('ready', async () => {
    for await (const [_, g] of client.guilds.cache) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(applicationId, g.id),
          { body: CommandList }
        )
      } catch (err) {
        console.log(err);
      }
    }
  })
}
