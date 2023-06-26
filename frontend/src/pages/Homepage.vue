<script lang="ts">
export default {
  data() {
    return {
      width: window.innerWidth < 900 ? '80%' : '600px',
      technicianAccess: "loading",
      adminAccess: "loading",
    };
  },
  beforeMount() {
    fetch("/checkaccess", { method: "GET"})
      .then((response) => {

        if (response.status === 401) {
          this.$router.push("/login");
          return undefined;
        }

        return response.json();
      })
      .then((data) => {
        this.technicianAccess = data.technicianAccess;
        this.adminAccess = data.adminAccess;
      });
  }
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
        Actions
      </v-card-title>
      <v-card-actions>
        <v-btn class="action-button">

        </v-btn>
        <v-btn class="action-button">

        </v-btn>
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
