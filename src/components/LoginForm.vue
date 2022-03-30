<template>
  <div class="d-flex justify-center" style="height: 120%">
    <v-form
      v-model="valid"
      ref="form"
      style="
        width: 40%;
        height: 100%;
        min-width: 400px;
        background-color: #ffffff;
      "
    >
      <v-container id="input">
        <!--      将内容居中展示-->
        <div class="ma-5">
          <div class="text-center">
            <span id="input-title"> 考勤打卡 </span>
          </div>
          <v-text-field
            v-model="user.account"
            :rules="nameRules"
            :counter="10"
            label="用户名"
            required
            prepend-inner-icon="mdi-account"
            clearable
            light
            :loading="load"
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="pwdRules"
            :counter="20"
            label="密码"
            required
            prepend-inner-icon="mdi-lock"
            clearable
            light
            :loading="load"
            :type="show ? 'text' : 'password'"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
          ></v-text-field>
          <v-btn
            elevation="2"
            block
            rounded
            :loading="load"
            color="primary"
            :disabled="!valid"
            light
            large
            @click="logConfirm"
          >
            <span style="font-size: 24px">登入</span>
            <v-icon right dark large> mdi-login-variant </v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "LoginForm",
  data: () => ({
    a: "",
    valid: false,
    user: {
      account: "",
      password: "",
    },
    nameRules: [
      (v) => !!v || "用户名不能为空",
      (v) => (v && v.length <= 10) || "用户名不能超过10位字符",
    ],
    pwdRules: [
      (v) => !!v || "密码不能为空",
      (v) => (v && v.length <= 20) || "密码不能超过20位字符",
      (v) => (v && v.length >= 6) || "密码不能短于6位字符",
    ],
    show: false,
    load: false,
    rememberPwd: false,
  }),
  created() {
    // 检测到Enter时尝试登入
    document.onkeydown = (e) => {
      this.$refs.form.validate();
      if (e.keyCode === 13 && this.valid) {
        this.logConfirm();
      }
    };
  },
  computed: {},
  methods: {
    async logConfirm() {
      console.log("try login");
      if (this.valid) {
        let form = {
          account: this.user.account,
          password: this.user.password,
        };

        try {
          // const response = await axios.post(
          //   "http://192.168.119.249:11401/login/signIn",
          //   {
          //     params: form,
          //   }
          // );
          const response = await axios.post(
            "http://192.168.119.249:11401/login/signIn",

            // account: this.user.account,
            // password: this.user.password,
            form
          );
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
};
</script>

<style scoped>
#input-title {
  font-family: "Microsoft YaHei UI Light", sans-serif;
  color: #2763c9;
  font-size: 24px;
}
#input {
  width: 60%;
  background-color: #ffffff;
  border-radius: 5%;
  box-shadow: 2px 2px rgba(30, 34, 39, 0.4), 4px 4px rgba(30, 34, 39, 0.3),
    6px 6px rgba(30, 34, 39, 0.2);
  border: rgba(30, 34, 39, 0.5) solid;
}
</style>
