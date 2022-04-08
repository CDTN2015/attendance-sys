<template>
  <div>
    <v-card id="card">
      <v-card-title>
        <span class="text-h5">查看申请</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form v-model="valid" ref="form" id="form">
            <v-row>
              <v-col cols="12"> </v-col>
              <v-col cols="12"> </v-col>
              <v-col cols="12"> </v-col>
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
import { timeout } from "@/api/function";

export default {
  name: "HandleRequest",
  data() {
    return {
      valid: false,
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
      this.snackbarStatue = true;
      this.snackbarMsg = "提交成功";
      this.snackbarType = "success";
      await timeout(1000);
      this.snackbarStatue = false;
      this.close();
    },
  },
};
</script>

<style scoped>
#card {
  opacity: 0.8;
}
</style>
