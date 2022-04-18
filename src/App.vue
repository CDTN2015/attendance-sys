<template>
  <v-app style="background: rgba(0, 0, 0, 0)">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  background-image: url("./assets/background3.jpg");
}
</style>
