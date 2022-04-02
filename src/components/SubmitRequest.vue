<template>
  <div>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-select :items="items" label="Outlined style"></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "SubmitRequest",
  data() {
    return {
      items: ["请假", "加班", "忘记打卡"],
      // 正常来说应该在localStorage中存加密的密码串吧？
      oldPassword: localStorage,
    };
  },
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
