<script lang="ts">
export default {
    data() {
        return {
            handy: window.innerWidth < 800 ? true : false,
            showAula: false,
            showMobile: false,
            showZuverlässig: false,
            imageLayout: [
                {
                    children: [{ cols: 12 }, { cols: 12 }],
                },
            ],
            aulaImg: [
                '/Atec_small.jpg',
                '/Atec_small.jpg',
                '/Atec_small.jpg',
            ],
            mobileImg: [
                '/Atec_small_w.jpg',
                '/Atec_small_w.jpg',
                '/Atec_small_w.jpg',
            ],
        }
    }
};
</script>


<template>
    <div v-if="!handy" class="wrapper">
        <v-dialog width="600px" close-on-content-click v-model="showAula">
            <v-card>
                <v-card-title>
                    Lokal
                </v-card-title>
                <v-card-img>
                    <v-row style="padding: 20px;">
                        <template :key="imgIdx" v-for="image, imgIdx in imageLayout">
                            <v-col>
                                <v-img :src="aulaImg[imgIdx]" cover height="100%"></v-img>
                            </v-col>
                            <v-col v-if="image.children" cols="6" class="d-flex flex-column">
                                <v-row>
                                    <v-col v-for="(children, childIdx) in image.children" :key="childIdx"
                                        :cols="children.cols">
                                        <v-img :src="aulaImg[imgIdx]" cover height="100%"></v-img>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </template>
                    </v-row>
                </v-card-img>
                <v-card-text>
                    In unserer Aula können wir Veranstaltungen mit bis zu 300 Personen unterstützen. <br>
                    Mit der in der Aula fest vorhandenen Bühne und der dazugehörigen Licht- und Tontechnik lassen sich fast
                    jeder Ihrer Wünsche umsetzen. <br>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog width="600px" close-on-content-click v-model="showMobile">
            <v-card>
                <v-card-title>
                    Mobil
                </v-card-title>
                <v-card-img>
                    <v-row style="padding: 20px;">
                        <template :key="imgIdx" v-for="image, imgIdx in imageLayout">
                            <v-col>
                                <v-img :src="mobileImg[imgIdx]" cover height="100%"></v-img>
                            </v-col>
                            <v-col v-if="image.children" cols="6" class="d-flex flex-column">
                                <v-row>
                                    <v-col v-for="(children, childIdx) in image.children" :key="childIdx"
                                        :cols="children.cols">
                                        <v-img :src="mobileImg[imgIdx]" cover height="100%"></v-img>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </template>
                    </v-row>
                </v-card-img>
                <v-card-text>
                    Mit unserer mobilen Anlage können wir auf dem ganzen Schulgeländer und außerhalb zuverlässig die
                    veranstaltungstechnische Unterstützung leisten, die Sie brauchen. <br>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog width="600px" close-on-content-click v-model="showZuverlässig">
            <v-card>
                <v-card-title>
                    Zuverlässig
                </v-card-title>
                <v-card-img style="padding: 20px;">
                    <v-img src="/login_bg.jpeg" cover></v-img>
                </v-card-img>
                <v-card-text>
                    Für uns ist es wichtig, dass Sie sich auf uns verlassen können. <br>
                    Deshalb sind wir immer pünktlich und zuverlässig. <br>
                    Wir sind immer für Sie da, wenn Sie uns brauchen. <br>
                    Deshalb ist es uns wichtig, dass Sie uns rechtzeitig kontaktieren, damit wir uns auf Ihre Veranstaltung
                    vorbereiten können. <br>
                </v-card-text>
            </v-card>
        </v-dialog>

        <img class="logo bg" src="/Atec_small.jpg">
        <v-card @click="showAula = true" width="300px" height="250px" color="secondary" location="top left">
            <v-card-title>
                Lokal
            </v-card-title>
            <v-card-text>
                <v-img height="170px" :src="aulaImg[0]" cover />
            </v-card-text>
        </v-card>
        <v-card @click="showMobile = true" width="300px" height="250px" color="secondary" location="top right">
            <v-card-title>
                Mobil
            </v-card-title>
            <v-card-text>
                <v-img cover height="170px" :src="mobileImg[0]" />
            </v-card-text>
        </v-card>
        <v-card @click="showZuverlässig = true" width="300px" height="250px" color="secondary" location="bottom left">
            <v-card-title>
                Zuverlässig
            </v-card-title>
            <v-card-text>
                <v-img height="170px" src="/login_bg.jpeg" cover />
            </v-card-text>
        </v-card>
        <v-card width="300px" height="250px" color="secondary" location="bottom right">
            <v-card-title>Kontakt</v-card-title>
            <v-card-text>
                <v-img src="/Atec_small.jpg" cover height="100px">
                </v-img>
                <p style="margin-bottom: 4px; margin-top: 6px; line-height: 1.2;">
                    <strong>Gymnasium Riedberg</strong> <br>
                    Friedrich-Dessauer-Str. 2 <br>
                    60438 Frankfurt am Main
                </p>
                <p>
                    <strong>E-Mail: </strong> @Lukas Email
                </p>
            </v-card-text>
        </v-card>
    </div>

    <div v-if="handy" class="mobile-wrapper">
        <v-card width="80%" max-height="none" color="secondary">
            <v-card-title>
                Lokal
            </v-card-title>
            <v-card-img>
                <v-carousel hide-delimiters>
                    <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover></v-carousel-item>
                    <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg" cover></v-carousel-item>
                    <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-carousel-item>
                </v-carousel>
            </v-card-img>
            <v-card-text>
                In unserer Aula können wir Veranstaltungen mit bis zu 300 Personen unterstützen. <br>
                Mit der in der Aula fest vorhandenen Bühne und der dazugehörigen Licht- und Tontechnik lassen sich fast
                jeder Ihrer Wünsche umsetzen. <br>
            </v-card-text>
        </v-card>

        <v-card width="80%" color="secondary">
            <v-card-title>
                Mobil
            </v-card-title>
            <v-card-img>
                <v-carousel hide-delimiters>
                    <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover></v-carousel-item>
                    <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg" cover></v-carousel-item>
                    <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-carousel-item>
                </v-carousel>
            </v-card-img>
            <v-card-text>
                Mit unserer mobilen Anlage können wir auf dem ganzen Schulgeländer und außerhalb zuverlässig die
                veranstaltungstechnische Unterstützung leisten, die Sie brauchen. <br>
            </v-card-text>
        </v-card>

        <v-card width="80%" color="secondary">
            <v-card-title>
                Zuverlässig
            </v-card-title>
            <v-card-img>
                <v-img src="/login_bg.jpeg" cover></v-img>
            </v-card-img>
            <v-card-text>
                Für uns ist es wichtig, dass Sie sich auf uns verlassen können. <br>
                Deshalb sind wir immer pünktlich und zuverlässig. <br>
                Wir sind immer für Sie da, wenn Sie uns brauchen. <br>
                Deshalb ist es uns wichtig, dass Sie uns rechtzeitig kontaktieren, damit wir uns auf Ihre Veranstaltung
                vorbereiten können. <br>
            </v-card-text>
        </v-card>

        <v-card width="80%" color="secondary">
            <v-card-title>
                Kontakt
            </v-card-title>
            <v-card-text>
                <p style="margin-bottom: 4px; line-height: 1.2;">
                    <strong>Gymnasium Riedberg</strong> <br>
                    Friedrich-Dessauer-Str. 2 <br>
                    60438 Frankfurt am Main
                </p>
                <p>
                    <strong>E-Mail: </strong> @Lukas Email
                </p>
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped>
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

.wrapper .v-card {
    position: absolute;
    margin-top: calc(64px + 40px);
    margin-left: 40px;
    margin-right: 40px;
    margin-bottom: 40px;
}

.mobile-wrapper {
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    min-height: calc(100vh - 64px);
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

img {
    width: auto;
    height: auto;
    max-height: 100%;
    max-width: 90%;
}
</style>
