<script lang="ts">
export default {
  data() {
    return {
      width: window.innerWidth < 900 ? '80%' : '600px',
    };
  },
}
</script>

<template>
  <div class="wrapper">
    <v-card :width="width">
      <v-card-title>
        Veranstaltung anmelden
      </v-card-title>
      <v-card-subtitle>
        Hier können Sie eine Veranstaltung anmelden.
      </v-card-subtitle>
      <v-card-actions>
        <v-btn variant="tonal" width="100%" href="/createevent">zum Formular</v-btn>
      </v-card-actions>
    </v-card>
    <v-card :width="width">
      <v-card-title>
        Abmelden
      </v-card-title>
      <v-card-subtitle>
        Hier können Sie sich ausloggen
      </v-card-subtitle>
      <v-card-actions>
        <v-btn variant="tonal" width="100%" href="/logout">Logout</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.v-card {
  padding: 20px;
}

.v-card-title {
  padding: 6px;
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
  font-size: 24px;
  height: 40px;
}

.v-card-subtitle {
  padding: 4px;
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
  font-size: 18px;
  height: 24px
}

.wrapper {
  display: flex;
  padding-top: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 60px;
}
</style>
