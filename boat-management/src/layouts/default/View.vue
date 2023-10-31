<template>
  <v-main>
    <v-overlay
      v-model="isLoading"
      contained
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
    <router-view @handleLoading="handleLoading" />
  </v-main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    handleLoading(isLoading) {
      this.isLoading = isLoading;
    },
  },
};
</script>
