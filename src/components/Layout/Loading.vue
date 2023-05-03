<template>
  <v-overlay
    v-model="$store.isLoading"
    contained
    class="align-center justify-center"
  >
    <v-progress-circular :size="60" indeterminate></v-progress-circular
  ></v-overlay>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>
