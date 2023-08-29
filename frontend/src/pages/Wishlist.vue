<script lang="ts">
interface IWishlistItem {
  _id: number;
  name: string;
  description: string;
  price: number;
  url: string;
  amount: number;
  status: "bought" | "accepted" | "pending" | "rejected";
}

export default {
  data() {
    return {
      isAdmin: document.cookie.includes("usertype=admin"),
      openAdminDialog: false,
      selectedWish: undefined as number | undefined,
      wishlist: [] as IWishlistItem[],
      updateEvent: {
        name: "",
        description: "",
        price: 0,
        url: "",
        amount: 0,
        status: "pending",
      },
      createdEvent: {
        name: "",
        description: "",
        price: 0,
        url: "",
        amount: 0,
      },
      error: {
        message: "",
        show: false,
      },
    };
  },
  methods: {
    openWish(index: number) {
      this.updateEvent = {
        name: this.wishlist[index].name,
        description: this.wishlist[index].description,
        price: this.wishlist[index].price,
        url: this.wishlist[index].url,
        amount: this.wishlist[index].amount,
        status: this.wishlist[index].status,
      };
      this.selectedWish = index;
      this.openAdminDialog = true;
    },
    async createWish() {
      try {
        const response = await fetch("/wishlist/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.createdEvent),
        });
        if (response.ok) {
          this.createdEvent = {
            name: "",
            description: "",
            price: 0,
            url: "",
            amount: 0,
          };
        } else {
          this.error.message = "Failed to create wish";
          this.error.show = true;
        }
      } catch (error) {
        this.error.message = "Failed to create wish";
        this.error.show = true;
      }
    },
    async updateWish() {
      try {
        if (this.selectedWish === undefined) {
          return;
        }

        const response = await fetch(
          `/wishlist/items/${this.wishlist[this.selectedWish]._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.updateEvent),
          }
        );
        if (response.ok) {
          this.updateEvent = {
            name: "",
            description: "",
            price: 0,
            url: "",
            amount: 0,
            status: "pending",
          };
        } else {
          this.error.message = "Failed to update wish";
          this.error.show = true;
        }
      } catch {
        this.error.message = "Failed to update wish";
        this.error.show = true;
      }
    },
  },
  async beforeMount() {
    try {
      const response = await fetch("/wishlist/items");
      this.wishlist = await response.json();
    } catch (error) {
      this.error.message = "Failed to fetch wishlist items";
      this.error.show = true;
    }
  },
};
</script>

<template>
  <div>
    <VDialog v-model="openAdminDialog">
      <VForm>
        <VCard>
          <VCardTitle> Wunsch bearbeiten </VCardTitle>
          <VCardText>
            <!-- form -->
            <VTextField
              v-model="updateEvent.name"
              label="Name"
              required
            ></VTextField>
            <VTextField
              v-model="updateEvent.description"
              label="Beschreibung"
              required
            ></VTextField>
            <VTextField
              v-model="updateEvent.price"
              label="Preis"
              hint="in Euro"
              required
            ></VTextField>
            <VTextField
              v-model="updateEvent.url"
              label="Link"
              required
            ></VTextField>
            <VTextField
              v-model="updateEvent.amount"
              label="Anzahl"
              type="number"
              required
            ></VTextField>
            <VSelect
              v-model="updateEvent.status"
              :items="['bought', 'accepted', 'pending', 'rejected']"
              label="Status"
              required
            ></VSelect>
          </VCardText>
          <VCardActions>
            <VBtn @click="openAdminDialog = false" outlined> Abbrechen </VBtn>
            <VBtn
              @click="
                openAdminDialog = false;
                updateWish();
              "
              outlined
            >
              Speichern
            </VBtn>
          </VCardActions>
        </VCard>
      </VForm>
    </VDialog>

    <v-alert v-if="error.show" color="error" :title="error.message"></v-alert>

    <VForm @submit.prevent="createWish">
      <VCard>
        <VCardTitle> Neuer Wunsch </VCardTitle>
        <VCardText>
          <!-- form -->
          <VTextField
            v-model="createdEvent.name"
            label="Name"
            required
          ></VTextField>
          <VTextField
            v-model="createdEvent.description"
            label="Beschreibung"
            required
          ></VTextField>
          <VTextField
            v-model="createdEvent.price"
            label="Preis"
            hint="in Euro"
            required
          ></VTextField>
          <VTextField
            v-model="createdEvent.url"
            label="Link"
            required
          ></VTextField>
          <VTextField
            v-model="createdEvent.amount"
            label="Anzahl"
            type="number"
            required
          ></VTextField>
        </VCardText>
        <VCardActions>
          <VBtn type="submit">Erstellen</VBtn>
        </VCardActions>
      </VCard>
    </VForm>

    <VList bg-color="background">
      <VListItem
        color="background"
        :key="index"
        v-for="(wish, index) in wishlist"
      >
        <div class="wrapper">
          <div class="row1">
            <h3>
              {{ wish.name }}
            </h3>
            <p>Preis: {{ wish.price }} €</p>
          </div>
          <div class="row2">
            <p>
              {{ wish.description }}
            </p>
          </div>
          <div class="row3">
            <p>
              Anzahl: {{ wish.amount }} <br />
              Status: {{ wish.status }}
            </p>
          </div>
          <div class="actions">
            <VBtn link :href="wish.url">Link öffnen</VBtn>
            <VBtn v-if="isAdmin" @click="openWish(index)"> Bearbeiten </VBtn>
          </div>
        </div>
      </VListItem>
    </VList>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border: 2px solid #fff;
  border-radius: 10px;
  box-sizing: border-box;
}

.wrapper .actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media screen and (max-width: 900px) {
  .wrapper {
    flex-direction: column;
  }
}
</style>
