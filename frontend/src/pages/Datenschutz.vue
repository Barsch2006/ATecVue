<script lang="ts">
export default {
    data() {
        return {
            width: window.innerWidth > 900 ? '600px' : '80%'
        }
    },
}
</script>

<template>
    <div class="wrapper">
        <img class="logo bg" src="/Atec_small.jpg">
        <v-sheet color="transparent">
            <v-card :width="width">
                <v-card-title>
                    Haftungsbeschränkung
                </v-card-title>
                <v-card-text>
                    Die Inhalte dieser Internetseite werden mit größtmöglicher Sorgfalt recherchiert. Dennoch können wir
                    keine
                    Haftung für die Richtigkeit, Vollständigkeit und Aktualität der bereit gestellten Informationen
                    übernehmen.

                    Wir sind bemüht, die Website unterbrechungsfrei zum Abruf anzubieten. Auch bei aller gebotenen Sorgfalt
                    können aber temporäre Ausfallzeiten nicht ausgeschlossen werden.

                    Diese Website umfasst Links und Einbettung auf/ von andere Webseiten. Diese unterliegen der Haftung des
                    jeweiligen Betreibers. Der Anbieter hat keinerlei Einfluss auf die aktuelle und zukünftige Gestaltung
                    und
                    auf die Inhalte der verknüpften Seiten. Etwaige Haftungsansprüche sind an den jeweiligen Anbieter zu
                    richten. Eine ständige Kontrolle dieser externen Links ist für uns ohne einen Grund nicht zumutbar. Bei
                    Kenntnis von Rechtsverstößen o.ä. werden derartige externe Links selbstverständlich so schnell wie
                    möglich
                    entfernt.
                </v-card-text>
            </v-card>
            <v-card :width="width">
                <v-card-title>
                    Urheberrecht
                </v-card-title>
                <v-card-text>
                    Sofern nicht anders gekenntzeichnet unterliegen alle Medien und Inhalte, sowohl in Bild als auch Schrift
                    dem
                    Betreiber
                    der Website.
                </v-card-text>
            </v-card>
            <v-card :width="width">
                <v-card-title>
                    Datenschutz
                </v-card-title>
                <v-card-text>
                    Wir weisen ausdrücklich darauf hin, dass die Datenübertragung im Internet Sicherheitslücken aufweisen
                    kann
                    und nicht lückenlos vor dem Zugriff durch Dritte geschützt werden kann. Die Verwendung der im Rahmen der
                    Website veröffentlichen Kontaktdaten zu gewerblichen Zwecken ist ausdrücklich nicht erwünscht, es sei
                    denn,
                    der Anbieter hat zuvor seine schriftliche Einwilligung erteilt oder es besteht bereits ein
                    geschäftlicher
                    Kontakt. Der Anbieter und alle auf dieser Website genannten Personen widersprechen hiermit jeder
                    kommerziellen Verwendung und Weitergabe ihrer Daten.
                </v-card-text>
            </v-card>
            <v-card :width="width">
                <v-card-title>
                    Anwendbares Recht
                </v-card-title>
                <v-card-text>
                    Es gilt lediglich das Recht der Bundesrepublik Deutschland.
                </v-card-text>
            </v-card>
        </v-sheet>
    </div>
</template>

<style scoped>
* {
    user-select: all !important;
}
.wrapper {
    display: flex;
    padding: 40px;
    box-sizing: border-box;
    height: calc(100vh - 64px);
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

img {
    width: auto;
    height: auto;
    max-height: 100%;
    max-width: 90%;
}

.v-sheet {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
}
</style>
