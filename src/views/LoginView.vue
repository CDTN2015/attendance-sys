<template>
  <div class="d-flex justify-center" id="login-form">
    <v-form v-model="valid" ref="form" id="form">
      <div class="text-center mb-8">
        <span id="form-title"> 恒力电控科技服务有限公司 </span>
      </div>
      <div>
        <v-container id="input">
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
              :loading="load"
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show = !show"
            ></v-text-field>
            <v-checkbox
              id="pwd-checkbox"
              v-model="rememberPwd"
              label="记住密码"
              on-icon="mdi-lock-check"
              off-icon="mdi-lock-remove"
              @click="cleanLogin"
            ></v-checkbox>
            <v-btn
              elevation="2"
              block
              rounded
              :loading="load"
              color="primary"
              :disabled="!valid"
              large
              @click="logConfirm"
            >
              <span style="font-size: 24px">登入</span>
              <v-icon right dark large> mdi-login-variant </v-icon>
            </v-btn>
          </div>
        </v-container>
        <v-snackbar
          v-model="loginStatue"
          :color="loginType === 'success' ? 'green' : 'red'"
          transition="scale-transition"
        >
          {{ loginMsg }}
        </v-snackbar>
      </div>
    </v-form>
  </div>
</template>

<script>
import router from "@/router";
import { axios } from "@/api/axiosConfig";
import { timeout } from "@/api/function";
export default {
  name: "LoginView",
  data: () => ({
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
    loginStatue: false,
    loginMsg: "",
    loginType: "info",
  }),
  created() {
    // 检测到Enter时尝试登入
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.$refs.form.validate();
        if (this.valid) {
          this.logConfirm();
        }
      }
    };
    this.user.account = localStorage.getItem("loginName");
    this.user.password = localStorage.getItem("loginPassword");
    this.rememberPwd = localStorage.getItem("rememberPwd");
  },
  computed: {},
  methods: {
    async logConfirm() {
      if (this.valid) {
        let form = {
          account: this.user.account,
          password: this.user.password,
        };
        // 暂时明文保存用户名和密码
        localStorage.setItem("loginName", form.account);
        if (this.rememberPwd) {
          localStorage.setItem("rememberPwd", this.rememberPwd);
          localStorage.setItem("loginPassword", form.password);
        }
        try {
          const response = await axios.post("/login/signIn", form);
          console.log(response);
          this.loginStatue = true;
          if (response.data.code === 200) {
            this.loginMsg = "登录成功，准备跳转";
            this.loginType = "success";
            localStorage.setItem("Token", response.data.data.token);
            localStorage.setItem("department", response.data.data.department);
            await timeout(1000);
            this.loginStatue = false;
            // 判断管理员与用户权限选择不同页面跳转
            await router.push({
              path: "/user",
            });
            // await router.replace({
            //   path: "/personal",
            // });
          } else {
            this.loginMsg = "登录失败，请重试";
            this.loginType = "error";
            console.log("响应拦截器？");
            localStorage.removeItem("Token");
            await timeout(2000);
            this.loginStatue = false;
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    cleanLogin() {
      localStorage.removeItem("rememberPwd");
      localStorage.removeItem("loginPassword");
    },
  },
};
</script>

<style scoped>
#login-form {
  margin-top: 5%;
}
#form {
  width: 40%;
  min-width: 400px;
  background-color: transparent;
}
#form-title {
  font-size: 30px;
  font-weight: bold;
  color: #85e5fd;
}
#form-title,
#input-title {
  /* 禁止选中 */
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
}
#form-title:after {
  right: 80px;
}
#input-title {
  font-family: "Microsoft YaHei UI Light", sans-serif;
  color: #2763c9;
  font-size: 24px;
}
#input {
  width: 60%;
  background-color: #ffffff;
  border-radius: 5%;
  box-shadow: 2px 2px rgba(130, 145, 164, 0.7), 4px 4px rgba(130, 145, 164, 0.5),
    6px 6px rgba(130, 145, 164, 0.3);
  border: rgba(130, 145, 164, 0.9) 2px solid;
}
</style>
