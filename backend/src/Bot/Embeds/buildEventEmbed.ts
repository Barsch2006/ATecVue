// build an Discord Embed out of an IEvent

import { EmbedBuilder } from "@discordjs/builders";
import IEvent from "../../Event/event";
import { Db, WithId } from "mongodb";
import { Client, Colors } from "discord.js";
import IUser from "./../../Auth/user";

export default async function buildEventEmbed(client: Client, event: WithId<IEvent>, db: Db): Promise<EmbedBuilder> {

    const embed = new EmbedBuilder()

    const techniker = [];
    for await (const id of event.participants ?? []) {
        const user = await db.collection<IUser>("users").findOne({ _id: id });
        if (user) {
            techniker.push(user.dId);
        }
    }

    embed.setTitle(event.title)
    embed.setDescription(event.description)
    embed.setAuthor({ name: event.name + " " + event.lastname })
    embed.addFields(
        {
            name: "Zeitraum",
            value: `<t:${event.start}:F> - <t:${event.end}:t>`,
            inline: true
        },
        {
            name: "Ort",
            value: event.location,
            inline: true
        },
        {
            name: "Mikrofone",
            value: event.microphones.toString(),
            inline: true
        },
        {
            name: "Headsets",
            value: event.headsets.toString(),
            inline: true
        },
        ...((event.beamer) ? [{
            name: "Beamer",
            value: event.beamer ? "Ja" : "Nein",
            inline: true
        },
        {
            name: "HDMI",
            value: event.hdmi ? "Ja" : "Nein",
            inline: true
        },
        {
            name: "VGA",
            value: event.vga ? "Ja" : "Nein",
            inline: true
        },
        {
            name: "USB",
            value: event.usb ? "Ja" : "Nein",
            inline: true
        }] : [{
            name: "Beamer",
            value: "Nein",
            inline: true
        }]),
        ...(event.notes ? [{
            name: "Notizen",
            value: event.notes,
            inline: false
        }] : []),
        ...((techniker.length > 0) ? [{
            name: "Techniker",
            value: techniker.map(id => `<@${id}>`).join(", "),
            inline: false,
        }] : [])
    )

    embed.setColor(Colors.DarkNavy)
    embed.setURL("https://debug-676.heeecker.me/technician#" + event._id);

    embed.setFooter({
        text: client.user?.username ?? "ATec Bot",
    })

    return embed;

}