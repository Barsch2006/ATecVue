import IUser from "Auth/user";
import { hash } from "bcrypt";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Db } from "mongodb";

export default async (interaction: CommandInteraction, db: Db): Promise<void> => {
    try {
        const user = interaction.user;
        const name = interaction.options.get('name')?.value ?? user.username;
        const contact = interaction.options.get('contact', true).value;

        const userCollection = db.collection<IUser>('users');

        const targetUser = await userCollection.findOne({ dId: user.id });
        // create a random 8 character password
        const pwd = Math.random().toString(36).slice(-8);

        if (targetUser === null) {
            // create user
            const newUser: IUser = {
                dId: user.id,
                username: name as string,
                contactAdress: contact as string,
                permissionLevel: 'user',
                password: await hash(pwd, 10)
            };

            const result = await userCollection.insertOne(newUser);
            const admins = await userCollection.find({ permissionLevel: 'admin' }).toArray();
            if (result.acknowledged) {
                // send a public embed with the user data
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Benutzer erstellt')
                        .setDescription(`Der Benutzer ${name} wurde erfolgreich mit dem type "user" erstellt.`)
                        .setTimestamp()
                        .setFields([
                            {
                                name: 'Benutzername',
                                value: name as string
                            },
                            {
                                name: 'Kontaktadresse',
                                value: contact as string
                            }
                        ]),
                    ],
                    ephemeral: false,
                    allowedMentions: {
                        users: admins.map(a => a.dId ?? ''),
                    }
                })
                // send a private message with the password
                interaction.client.users.fetch(user.id).then(async u => {
                    await u.send(`Dein Account wurde erfolgreich erstellt. Dein Passwort lautet: ${pwd}. Bitte ändere es so schnell wie möglich.`);
                });
            } else {
                interaction.reply(`Der Benutzer konnte nicht registriert werden.`)
            }

        } else {
            interaction.reply(`Der Benutzer existiert bereits.`)
        }
    } catch (error) {
        console.error("Error creating event:", error);
        interaction.reply(`Es ist ein Fehler aufgetreten.`)
    }
}
