import { EmbedBuilder } from "@discordjs/builders";
import IEvent from "../../Event/event";
import { Db, WithId } from "mongodb";
import { Client, Colors } from "discord.js";
import IUser from "./../../Auth/user";

export default async function buildEventEmbed(client: Client, event: WithId<IEvent>, db: Db): Promise<EmbedBuilder> {
    // Create a new EmbedBuilder object
    const embed = new EmbedBuilder();

    // Create an array to store technicians' IDs
    const techniker = [];

    // Iterate over the participants' IDs in the event object
    for await (const id of event.participants ?? []) {
        // Retrieve the user object from the MongoDB collection based on the ID
        const user = await db.collection<IUser>("users").findOne({ _id: id });
        // If the user exists, add their Discord ID to the techniker array
        if (user) {
            techniker.push(user.dId);
        }
    }

    // Set the title, description, and author of the embed
    embed.setTitle(event.title);
    embed.setDescription(event.description);
    embed.setAuthor({ name: event.name + " " + event.lastname });

    // Add fields to the embed, representing event details
    embed.addFields(
        {
            name: "Zeitraum",
            value: `<t:${event.start}:F> - <t:${event.end}:t>`,
            inline: false
        },
        {
            name: "Ort",
            value: event.location,
            inline: false
        },
        {
            name: "Mikrofone",
            value: event.microphones.toString(),
            inline: false
        },
        {
            name: "Headsets",
            value: event.headsets.toString(),
            inline: false
        },
        // Check if the event has a beamer
        ...(event.beamer ? [
            {
                name: "Beamer",
                value: event.beamer ? "Ja" : "Nein",
                inline: false
            },
            {
                name: "HDMI",
                value: event.hdmi ? "Ja" : "Nein",
                inline: false
            },
            {
                name: "VGA",
                value: event.vga ? "Ja" : "Nein",
                inline: false
            },
            {
                name: "USB",
                value: event.usb ? "Ja" : "Nein",
                inline: false
            }
        ] : [
            {
                name: "Beamer",
                value: "Nein",
                inline: false
            }
        ]),
        // Check if the event has notes
        ...(event.notes ? [
            {
                name: "Notizen",
                value: event.notes,
                inline: false
            }
        ] : []),
        // Check if there are technicians assigned to the event
        ...(techniker.length > 0 ? [
            {
                name: "Techniker",
                value: techniker.map(id => `<@${id}>`).join(", "),
                inline: false,
            }
        ] : [])
    );

    // Set the color, URL, and footer of the embed
    embed.setColor(Colors.DarkNavy);
    embed.setURL("https://atec.heeecker.me/technician#" + event._id);
    embed.setFooter({
        text: client.user?.username ?? "ATec Bot",
    });

    return embed;
}
