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
        <v-card :width="width">
            <v-card-title>
                Verantwortlich für diese Website
            </v-card-title>
            <v-card-text>
                <strong>
                    Aula-Technik-AG Gymnasium Riedberg
                </strong> <br>
                Friedrich-Dessauer-Str. 2 <br>
                60438 Frankfurt am Main <br>
                Fon: 069 / 212-44001 <br>
                Fax: 069 / 212-44755 <br>
                E-Mail: <a href="mailto:">
                    todo 
                </a>
                <br> <br>
                <strong>Verantwortliche Person (vgl. § 5 Abs. 1, Nr. 1 Telemediengesetz)</strong> <br>
                AG-Leiter: todo <br>
            </v-card-text>
        </v-card>
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

.v-card {
    position: absolute;
    margin-top: 10px;
    margin-bottom: 10px;
}

img {
    width: auto;
    height: auto;
    max-height: 100%;
    max-width: 90%;
}
</style>
