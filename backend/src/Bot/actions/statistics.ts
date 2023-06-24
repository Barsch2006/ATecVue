import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { Db } from "mongodb";
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

export default async (client: Client, interaction: CommandInteraction, db: Db): Promise<void> => {
    const target = interaction.options.getUser('target', false);

    const userCollection = db.collection('users');
    const eventCollection = db.collection('events');

    if (target) {
        // just statistics for one user
        interaction.reply('Diese Funktion ist noch nicht verfügbar.');

    } else {
        // general statistics over the events

        // get the following infos from the database: amoutEvents, top3Users (users with the most participations)
        const amountEvents = await eventCollection.countDocuments();
        const top3Users = await userCollection.find().sort({ amountParticipations: -1 }).limit(3).toArray();
        // get the amount of events per month as an number array
        let eventsInMonth = await eventCollection.aggregate([
            {
                $group: {
                    _id: { $month: '$date' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]).toArray();
        // fill the array with 0 if there is no event in a month
        for (let i = 0; i < 12; i++) {
            if (!eventsInMonth[i] || eventsInMonth[i]._id !== i + 1) {
                eventsInMonth.splice(i, 0, { _id: i + 1, count: 0 });
            }
        }
        // map the array to only contain the count
        eventsInMonth = eventsInMonth.map(month => month.count);

        // draw a chart with the data from the eventsInMonth array
        const chart = new ChartJSNodeCanvas({ width: 800, height: 600 });
        const chartConfig: any = {
            type: 'bar',
            data: {
                datasets: [{
                    data: eventsInMonth
                }],
                labels: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
                    'August', 'September', 'Oktober', 'November', 'Dezember']
            }
        };

        // send the data as a embed to the user
        await interaction.reply({
            files: [
                {
                    attachment: await chart.renderToBuffer(chartConfig),
                    name: 'chart.png'
                }
            ],
            embeds: [
                new EmbedBuilder()
                    .setTitle('Statistiken')
                    .setDescription(`Hier sind die Statistiken der ATec:`)
                    .addFields(
                        { name: 'Anzahl Events', value: amountEvents.toString() },
                        { name: 'Top 3 Benutzer', value: top3Users.map((user, index) => `${index + 1}. ${user.name} (${user.amountParticipations} Teilnahmen)`).join('\n') },
                        { name: 'Events pro Monat', value: 'Hier ist eine Grafik mit der Anzahl der Events pro Monat:' }
                    )
                    .setImage(`attachment://chart.png`)
                    .setTimestamp()
            ]
        });
    }
}