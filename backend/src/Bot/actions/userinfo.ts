import { Client, CommandInteraction } from "discord.js";
import { Db } from "mongodb";

export default async (client: Client, interaction: CommandInteraction, db: Db): Promise<void> => {
    const target = interaction.options.getUser('target', true);

    const userCollection = db.collection('users');

    const targetUser = await userCollection.findOne({ username: target.username });
    if (targetUser === null) {
        interaction.reply(`Der Benutzer ${target.username} existiert nicht.`);
    } else {
        interaction.reply(`Kontaktinformationen von ${target.username}:\n${targetUser?.contactAdress}`)
    }
}