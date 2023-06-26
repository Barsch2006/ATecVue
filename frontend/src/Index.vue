<script lang="ts" setup>
import ATecHeader from './components/ATecHeader.vue';
import ATecFooter from './components/ATecFooter.vue';
</script>

<template>
  <v-app>
    <ATecHeader />

    <v-main>
      <router-view> </router-view>
    </v-main>
  </v-app>

  <ATecFooter />
</template>