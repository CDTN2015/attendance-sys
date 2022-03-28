<template>
  <div id="te">
    <button @click="test" class="warning">push to router</button>
    <div v-show="true">1</div>
    <div class="primary d-flex flex-column" v-if="show2">2</div>
    <div class="primary d-flex flex-column" v-if="show3">3</div>
  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "LoginView",
  data() {
    return {
      show1: false,
      show2: true,
      show3: false,
    };
  },
  methods: {
    test() {
      this.show1 = !this.show1;
      console.log(router.currentRoute.path);
    },
  },
};
</script>

<style scoped>
div {
  background-color: aqua;
}
#te div:nth-child(2) {
  width: 400px;
  height: 50px;
  background-color: aqua;
  color: black;
}
</style>
