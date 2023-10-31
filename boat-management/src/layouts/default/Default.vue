<template>
  <v-app>
    <default-view />
  </v-app>
</template>

<script lang="ts">
import DefaultView from "./View.vue";
export default {
  components: {
    "default-view": DefaultView,
  },
};
</script>
