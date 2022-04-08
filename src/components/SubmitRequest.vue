<template>
  <div>
    <v-card id="card">
      <v-card-title>
        <span class="text-h5">提交申请</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-select
            v-model="selectType"
            :items="items"
            label="事务类型"
            @change="resetSnackbar"
          ></v-select>
          <!--          请假和加班格式相同，复用-->
          <RequestList ref="AskForLeave" :type="selectType" />
          <!--          <ForgetPunch v-if="selectType === '忘记打卡'" ref="ForgetPunch" />-->
        </v-container>
        <small>可使用鼠标滚轮切换月份和时间</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color=" darken-1" @click="close"> 取消填写 </v-btn>
        <v-btn color=" darken-1 primary" @click="submit"> 提交申请 </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import RequestList from "@/components/RequestList";
// import { timeout } from "@/api/function";
export default {
  name: "SubmitRequest",
  data() {
    return {
      selectType: "请假",
      items: ["请假", "加班", "忘记打卡"],
    };
  },
  components: { RequestList },
  methods: {
    close() {
      this.resetSnackbar();
      // 根据后续开发情况选择是否保留延迟
      setTimeout(() => {
        this.$emit("closeDialog", "SubmitRequest");
      }, 500);
    },
    async submit() {
      if (await this.$refs.AskForLeave.submit()) {
        this.close();
      }
    },
    resetSnackbar() {
      this.$refs.AskForLeave.snackbarStatue = false;
    },
  },
};
</script>

<style scoped>
#card {
  opacity: 0.8;
}
</style>
