<script lang="ts">
export default {
    props: {
        msg: String,
    }
}
</script>

<template>
    <v-alert type="error" title="Fehler" variant="tonal" dismissible>{{ msg }}</v-alert>
</template>

<style scoped>

</style>
