<script lang="ts">
export default {

}
</script>

<template>
    <v-app-bar color="black" scroll-behavior="collapse">
        <v-app-bar-nav-icon>
            <img src="/Atec_small.jpg" />
        </v-app-bar-nav-icon>
        <v-app-bar-title>
            ATec Event-Anmeldung
        </v-app-bar-title>
        <template v-slot:append>
            <v-btn @click="$router.push('/home')" prepend-icon="mdi-home">
                Startseite
            </v-btn>
        </template>
    </v-app-bar>
</template>

<style scoped>
header {
    font-size: 30px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: auto;
    background-color: #000;
    box-sizing: border-box;
    height: 64px;
    padding: 0 10px;
}

.v-btn {
    margin: 0 20px;
}

header img {
    max-height: 64px;
}
</style>
