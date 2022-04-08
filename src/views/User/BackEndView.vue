<template>
  <div class="table">
    <v-row class="mx-10" style="text-align: center">
      <v-col cols="12" class="mt-2 justify-center">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
          open-on-hover
        >
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" class="title-inner">
              {{ queryMonth }}
              <span class="title-outer">全体员工考勤记录 </span>
            </span>
          </template>
          <v-date-picker
            v-model="selectMonth"
            type="month"
            @input="setMonth"
            no-title
            scrollable
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12">
        <v-divider dark></v-divider>
      </v-col>
    </v-row>

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
import { axios } from "@/api/axiosConfig";
import router from "@/router";
import { timeout } from "@/api/function";

export default {
  name: "BackEndView",
  data() {
    return {
      snackbarStatue: false,
      snackbarType: "",
      snackbarMsg: "",
      menu: false,
    };
  },
  created() {
    this.selectMonth = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substring(0, 7);
    console.log(`本月为: ${this.selectMonth}`);
    this.updateList();
  },
  computed: {
    queryMonth() {
      return `${this.selectMonth.substring(0, 4)}年
      ${Number(this.selectMonth.substring(5, 7))}月`;
    },
  },
  methods: {
    async updateList() {
      try {
        // console.log(`查询月为: ${this.selectMonth}`);
        const response = await axios.get("/workAttendance/list", {
          params: {
            workMonth: this.selectMonth,
          },
        });
        console.log(response);
        this.snackbarStatue = true;
        if (response.data.code === 200) {
          this.snackbarMsg = "数据获取成功";
          this.snackbarType = "success";
          this.detailList = response.data.data.detailList;
          this.lackHour = response.data.data.lackHour;
          this.monthWorkDay = response.data.data.monthWorkDay;
          this.realWorkDay = response.data.data.realWorkDay;
          this.workHour = response.data.data.workHour;
          this.workMonth = this.monthWorkDay * 8;
          console.log(this.detailList);
        } else {
          this.snackbarMsg = "数据获取失败，请重试";
          this.snackbarType = "error";
          await router.push({
            path: "/",
          });
        }
        await timeout(2000);
        this.snackbarStatue = false;
      } catch (error) {
        console.error(error);
      }
    },
    setMonth() {
      this.menu = false;
      this.updateList();
    },
  },
};
</script>

<style scoped>
.table {
  margin: 50px auto;
  width: 90%;
  height: 80%;
  background-color: rgba(36, 43, 95, 0.2);
}
.title-outer,
.title-inner {
  font-size: 20px;
  font-weight: bold;
  /* 禁止选中 */
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
}
.title-outer {
  color: rgb(118, 202, 214);
}
.title-inner {
  color: white;
}
</style>
