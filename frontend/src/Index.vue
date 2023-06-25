<script lang="ts" setup>
import ATecHeader from './components/ATecHeader.vue';
import ATecFooter from './components/ATecFooter.vue';

if (window.location.href.includes('/home') && !loggedIn()) {
  window.location.href = '/';
} else if (window.location.href.includes('/admin') && loggedIn()) {
  window.location.href = '/';
} else if (window.location.href.includes('/createevent') && loggedIn()) {
  window.location.href = '/';
} else if (window.location.href.includes('/technician') && loggedIn()) {
  window.location.href = '/';
} else if (window.location.href.includes('/logger') && loggedIn()) {
  window.location.href = '/';
}

if (loggedIn() && window.location.href.includes('/')) {
  window.location.href = '/home';
}

function loggedIn(): boolean {
  // check if cookie "token" exists if yes return true
  if (document.cookie.includes('token')) {
    return true;
  } else {
    return false;
  }
}

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