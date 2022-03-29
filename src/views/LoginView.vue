<template>
  <LoginForm />
</template>

<script>
import router from "@/router";
import LoginForm from "@/components/LoginForm";

export default {
  name: "LoginView",
  data: () => ({}),
  components: {
    LoginForm,
  },
  methods: {
    test() {
      this.show1 = !this.show1;
      console.log(router.currentRoute.path);
    },
  },
};
</script>

<style scoped></style>
