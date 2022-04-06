<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="text-h5">提交申请</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-select
            v-model="selectType"
            :items="items"
            label="事务类型"
          ></v-select>
          <AskForLeave v-if="selectType === '请假'" />
          <WorkOvertime v-if="selectType === '加班'" />
          <ForgetPunch v-if="selectType === '忘记打卡'" />
        </v-container>
        <small>可使用鼠标滚轮切换月份</small>
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
import AskForLeave from "@/components/submitRequests/AskForLeave";
import WorkOvertime from "@/components/submitRequests/WorkOvertime";
import ForgetPunch from "@/components/submitRequests/ForgetPunch";
export default {
  name: "SubmitRequest",
  data() {
    return {
      selectType: "请假",
      items: ["请假", "加班", "忘记打卡"],
    };
  },
  components: { AskForLeave, WorkOvertime, ForgetPunch },
  methods: {
    close() {
      this.$emit("closeDialog", "SubmitRequest");
    },
    submit() {
      this.close();
    },
  },
};
</script>

<style scoped></style>
