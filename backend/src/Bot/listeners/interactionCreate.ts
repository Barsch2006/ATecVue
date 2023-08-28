import userinfo from "../actions/userinfo";
import register from "../actions/register";

import {
  CommandInteraction,
  Client,
  Interaction,
  ButtonInteraction,
} from "discord.js";
import { Db } from "mongodb";
import IEvent from "../../Event/event";
import IUser from "../../Auth/user";
import buildEventEmbed from "../Embeds/buildEventEmbed";
import { buildEventMessageComponents } from "../Bot";
import about from "../actions/about";

export default (client: Client, db: Db): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      await handleSlashCommand(interaction, db);
    }
    if (interaction.isButton()) {
      await handleButtonInteraction(client, interaction, db);
    }
  });
};

const handleSlashCommand = async (
  interaction: CommandInteraction,
  db: Db
): Promise<void> => {
  switch (interaction.commandName) {
    case "userinfo":
      await userinfo(interaction, db);
      break;
    case "register":
      await register(interaction, db);
      break;
    case "about":
      await about(interaction);
      break;
  }
};

const handleButtonInteraction = async (
  client: Client,
  interaction: ButtonInteraction,
  db: Db
): Promise<void> => {
  if (interaction.customId === "event-participate") {
    await newParticipant(client, interaction, db);
  }
  if (interaction.customId === "event-update") {
    await updateEventMessage(interaction, db);
  }
  if (interaction.customId === "event-cancel") {
    await cancelEvent(interaction, db);
  }
};

async function newParticipant(
  client: Client,
  interaction: ButtonInteraction,
  db: Db
) {
  const event_id = interaction.message.id;
  const event_obj = await db
    .collection<IEvent>("events")
    .findOne({ discordMessageId: { $eq: event_id } });
  if (!event_obj) {
    await interaction.reply({
      content: "Fehler. Event nicht gefunden.",
      ephemeral: true,
    });
    return;
  }
  // get the user by username
  const user = await db
    .collection<IUser>("users")
    .findOne({ dId: interaction.user.id });

  if (!user) {
    await interaction.reply({
      content: "Fehler. User nicht gefunden.",
      ephemeral: true,
    });
    return;
  }

  event_obj.participants = event_obj.participants ?? [];

  // check if users id is in the participants list of the event
  if (event_obj.participants.some((id) => id.equals(user._id))) {
    await interaction.reply({
      content: "Du übernimmst diese Veranstaltung bereits",
      ephemeral: true,
    });
    return;
  }
  await db.collection<IEvent>("events").updateOne(
    { _id: event_obj._id },
    {
      $push: {
        participants: user._id,
      },
    }
  );
  await interaction.reply({
    content: "Du wurdest in die Veranstaltung eingetragen",
    ephemeral: true,
  });

  // update the event message
  if (interaction.message.editable) {
    await interaction.message.edit({
      embeds: [await buildEventEmbed(client, event_obj, db)],
    });
  }
}

async function updateEventMessage(interaction: ButtonInteraction, db: Db) {
  const messageId = interaction.message.id;
  const event = await db
    .collection<IEvent>("events")
    .findOne({ discordMessageId: { $eq: messageId } });
  if (!event) {
    await interaction.reply({
      content: "Fehler. Event nicht gefunden.",
      ephemeral: true,
    });
    return;
  }
  if (interaction.message.editable) {
    await interaction.message.edit({
      embeds: [await buildEventEmbed(interaction.client, event, db)],
      components: [buildEventMessageComponents()],
    });
    await interaction.reply({
      content: "Event Nachricht aktualisiert",
      ephemeral: true,
    });
  } else {
    await interaction.reply({
      content: "Fehler. Event Nachricht nicht editierbar.",
      ephemeral: true,
    });
  }
}

async function cancelEvent(interaction: ButtonInteraction, db: Db) {
  // remove the interactions participant from the event
  const event_id = interaction.message.id;
  const event_obj = await db
    .collection<IEvent>("events")
    .findOne({ discordMessageId: { $eq: event_id } });
  if (!event_obj) {
    await interaction.reply({
      content: "Fehler. Event nicht gefunden.",
      ephemeral: true,
    });
    return;
  }
  // get the user by username
  const user = await db
    .collection<IUser>("users")
    .findOne({ dId: interaction.user.id });

  if (!user) {
    await interaction.reply({
      content: "Fehler. User nicht gefunden.",
      ephemeral: true,
    });
    return;
  }

  event_obj.participants = event_obj.participants ?? [];

  // check if users id is in the participants list of the event
  if (!event_obj.participants.some((id) => id.equals(user._id))) {
    await interaction.reply({
      content: "Du bist nicht in dieser Veranstaltung",
      ephemeral: true,
    });
    return;
  }

  await db.collection<IEvent>("events").updateOne(
    { _id: event_obj._id },
    {
      $pull: {
        participants: user._id,
      },
    }
  );
  await interaction.reply({
    content: "Du wurdest aus der Veranstaltung entfernt",
    ephemeral: true,
  });

  // update the event message
  if (interaction.message.editable) {
    await interaction.message.edit({
      embeds: [await buildEventEmbed(interaction.client, event_obj, db)],
    });
  }
}
