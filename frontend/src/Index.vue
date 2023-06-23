<script lang="ts" setup>
import ATecHeader from './components/ATecHeader.vue';
</script>

<template>
    <v-app>
    <ATecHeader />

    <v-main>
      <router-view> </router-view>
    </v-main>
  </v-app>
</template>