<script lang="ts">
export default {

}
</script>

<template>
    <v-app-bar color="black" scroll-behavior="collapse">
        <img @click="$router.push('/')" src="/Atec_small.jpg" />
        <v-spacer></v-spacer>
        <v-app-bar-nav-icon>
            <v-icon size="32" @click="$router.push('/')" icon="mdi-home" ></v-icon>
        </v-app-bar-nav-icon>
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
