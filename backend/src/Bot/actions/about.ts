import { CommandInteraction, EmbedBuilder } from "discord.js";

export default async (interaction: CommandInteraction): Promise<void> => {
  try {
    const aboutEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Etwas über mich")
      .setAuthor({ name: "ATec ", url: "https://atec.heeecker.me" })
      .setDescription(
        "Ich bin ein Bot, welcher zur Benachrichtung der Veranstaltungstechniker der Aula Technik AG des Gymnasium Riedbergs entwickelt wurde. Ich bin Teil der Web-App https://atec.heeecker.me \nIch sende in <#1124422763818516581> Nachrichten, wenn eine Person eine neue Veranstaltung angemeldet hat. \nÜber die Schaltflächen unter der Nachricht kannst du dich für die Veranstaltung eintragen. Das bedeutet, dass du mindestens 50 % der Dauer der Veranstaltung aktiv in der Technik bist. \nFalls du doch nicht kannst, aber dich bereits eingetragen hast, kannst du dich auch wieder austragen. Bitte sage in diesem Fall den anderen jedoch Bescheid, damit sie es mitbekommen. Mit `/register` kannst du dir übrigens einen eigenen Account auf der Web-App machen, sofern du noch keinen hast.\n\n**__Meine Entwickler:__**"
      )
      .addFields(
        {
          name: "Filip",
          value: "<@768872955500953710",
          inline: true,
        },
        {
          name: "Christian",
          value: "<@779419763938951228>",
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: "\u200B",
        iconURL: "https://atec.heeecker.me/Atec_small.jpg",
      });

    await interaction.reply({
      embeds: [aboutEmbed],
    });
  } catch (error) {
    interaction.reply({
      content: `Es ist ein Fehler aufgetreten.`,
      ephemeral: true,
    });
  }
};
