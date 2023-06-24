import IUser from "Auth/user";
import { CommandInteraction } from "discord.js";
import { Db } from "mongodb";

export default async (interaction: CommandInteraction, db: Db): Promise<void> => {
    const target = interaction.options.getUser('target', true);

    const userCollection = db.collection<IUser>('users');

    const targetUser = await userCollection.findOne({ dId: target.id });
    if (targetUser === null) {
        interaction.reply(`Der Benutzer ${target.username} existiert nicht.`);
    } else {
        interaction.reply(`Kontaktinformationen von ${target.username}:\n${targetUser?.contactAdress}`)
    }
}