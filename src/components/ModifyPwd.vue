<template>
  <div>
    <v-card id="card">
      <v-card-title>
        <span class="text-h5">修改密码</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form v-model="valid" ref="form" id="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="password.old"
                  :rules="pwdRules"
                  counter
                  label="请输入当前密码*"
                  type="password"
                  required
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password.new"
                  :rules="newPwdRules"
                  :counter="20"
                  label="请输入新密码*"
                  required
                  clearable
                  :type="show ? 'text' : 'password'"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show = !show"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password.repeat"
                  :rules="repeatPwdRules"
                  counter
                  label="重复输入新密码*"
                  type="password"
                  persistent-hint
                  required
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <small>*表示必填字段</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color=" darken-1" @click="close"> 取消修改 </v-btn>
        <v-btn color=" darken-1 primary" @click="submit"> 修改密码 </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="snackbarStatue"
      :color="snackbarType === 'success' ? 'green' : 'red'"
      transition="scale-transition"
    >
      {{ snackbarMsg }}
    </v-snackbar>
  </div>
</template>

<script>
// import { axios } from "@/api/axiosConfig";
// import router from "@/router";
import { timeout } from "@/api/function";

export default {
  name: "ModifyPwd",
  data() {
    return {
      valid: false,
      password: {
        // 正常来说应该在localStorage中存加密的密码串吧？
        old: "",
        new: "",
        repeat: "",
      },
      pwdRules: [(v) => !!v || "不能为空"],
      newPwdRules: [
        (v) => !!v || "不能为空",
        (v) => (v && v.length <= 20) || "密码不能超过20位字符",
        (v) => (v && v.length >= 6) || "密码不能短于6位字符",
      ],
      repeatPwdRules: [
        (v) => !!v || "不能为空",
        (v) => v === this.password.new || "两次密码需要一致",
      ],
      show: false,
      snackbarStatue: false,
      snackbarMsg: "",
      snackbarType: "info",
    };
  },
  methods: {
    close() {
      this.$emit("closeDialog", "ModifyPwd");
    },
    async submit() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.password.old === this.password.new) {
          this.snackbarStatue = true;
          this.snackbarMsg = "新旧密码一致";
          this.snackbarType = "warning";
          await timeout(2000);
          this.snackbarStatue = false;
        } else {
          let form = {
            account: localStorage.getItem("loginName"),
            password: this.password.new,
          };
          console.log(form);
          // try {
          //   const response = await axios.post("/login/updatePassword", form);
          //   console.log(response);
          //   this.loginStatue = true;
          //   if (response.data.code === 200) {
          //     this.loginMsg = "修改成功";
          //     this.loginType = "success";
          //     // 判断管理员与用户权限选择不同页面跳转
          //     await router.push({
          //       path: "/user",
          //     });
          //     // await router.replace({
          //     //   path: "/personal",
          //     // });
          //   } else {
          //     this.loginMsg = "修改失败";
          //     this.loginType = "error";
          //     console.log("响应拦截器？");
          //     localStorage.removeItem("Token");
          //   }
          //   await timeout(3000);
          //   this.loginStatue = false;
          // } catch (error) {
          //   console.error(error);
          // }
          this.snackbarStatue = true;
          this.snackbarMsg = "修改成功";
          this.snackbarType = "success";
          await timeout(1000);
          this.snackbarStatue = false;
          this.close();
        }
      }
    },
  },
};
</script>

<style scoped>
#card {
  opacity: 0.8;
}
</style>
