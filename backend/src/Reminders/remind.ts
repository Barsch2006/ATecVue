// import { EmbedBuilder } from "@discordjs/builders";
import IUser from "../Auth/user";
import ATecBot from "../Bot/Bot";
import buildEventEmbed from "../Bot/Embeds/buildEventEmbed";
import IEvent from "../Event/event";
import { ChannelType, Colors, EmbedBuilder } from "discord.js";
import { Db } from "mongodb";


export default function reminder(client: ATecBot, db: Db) {

    if (!process.env.DISCORD_REMINDER_CHANNEL) {
        throw new Error("ENV: DISCORD_REMINDER_CHANNEL is missing!");
    }

    setInterval(async () => {
        if (!process.env.DISCORD_REMINDER_CHANNEL) {
            throw new Error("ENV: DISCORD_REMINDER_CHANNEL is missing!");
        }

        // check if it is 7:30 CET
        if (checkTimeCET(7, 30)) {

            // get the reminders channel
            const channel = await client.channels.fetch(process.env.DISCORD_REMINDER_CHANNEL);

            if (!channel) {
                console.warn("Reminder Channel not found!")
                return;
            }

            if (channel.type !== ChannelType.GuildText) {
                throw new Error("Channel is not a text channel!");
            }

            // lookup events for next 24 hours
            const events = await db.collection<IEvent>("events").find({
                start: {
                    $gte: Date.now() / 1000,
                    $lte: Date.now() / 1000 + 86400 // now + 24h
                }
            }).toArray();

            if (events.length === 0) {
                // no events found
                // send a silent message that no events are found for today
                await channel.send({
                    flags: [ 4096 ],
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.DarkRed)
                            .setTitle("Guten Morgen!")
                            .setDescription("Im System sind keine Events für die nächsten 24 Stunden eingetragen")
                            .setFooter({
                                text: "ATec Bot",
                            })
                            .setTimestamp(new Date())
                    ]
                });
            }

            // send a message for each event, pinging the technicians participating
            for await (const event of events) {

                let ping = "";
                // get the technicians participating
                for await (const technician of event.participants ?? []) {
                    // get dId of technician
                    const technicianData = await db.collection<IUser>("technicians").findOne({ _id: technician });
                    if (technicianData && technicianData.dId) {
                        ping += `<@${technicianData.dId}> `;
                    }
                }

                // send the message
                await channel.send({
                    content: ping,
                    embeds: [
                        await buildEventEmbed(client, event, db),
                    ]
                });

            }


        }
    }, 1000 * 45)


}
function checkTimeCET(hour: number, minute: number): boolean {
    if (new Date().toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin" }).startsWith(`${hour}:${(minute < 10 ? "0" : "") + minute}`)) {
        return true;
    }
    return false;
}

