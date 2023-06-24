<script lang="ts">
export default {

}
</script>

<template>
    <div>
        <!-- list of issues -->
        <v-btn class="floating_action_btn" @click="$router.push('/logger/create')" color="primary" icon="mdi-plus" rounded
            title="Neuer Eintrag" />
    </div>
</template>

<style scoped>
.floating_action_btn {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 20px;
}
</style>
