<template>
  <!--  <p>test</p>-->
  <div class="table">
    <v-row class="mx-10" style="text-align: center">
      <v-col cols="12" sm="6" md="4" lg="3" class="mt-2 justify-center">
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
              <span class="title-outer">考勤记录 </span>
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
      <v-col cols="6" sm="6" md="4" lg="2" class="mt-2">
        <span class="title-outer">
          当月出勤:<span class="title-inner">{{ monthWorkDay }}</span
          >天
        </span>
      </v-col>
      <v-col cols="6" sm="6" md="4" lg="2" class="mt-2">
        <span class="title-outer">
          当月实勤:<span class="title-inner">{{ realWorkDay }}</span
          >天
        </span>
      </v-col>
      <v-col cols="6" sm="6" md="4" lg="2" class="mt-2">
        <span class="title-outer">
          已工作<span class="title-inner">{{ workHour }}</span
          >小时
        </span>
      </v-col>
      <v-col cols="6" sm="6" md="4" lg="2" class="mt-2">
        <span class="title-outer">
          需补卡<span class="title-inner">996</span>小时
        </span>
      </v-col>
      <v-col cols="12">
        <v-divider dark></v-divider>
      </v-col>
    </v-row>

    <div class="pollution-content">
      <ul class="pollution-top">
        <li style="width: 10%">日期</li>
        <li style="width: 9%">上班时间</li>
        <li style="width: 9%">下班时间</li>
        <li style="width: 9%">迟到时长</li>
        <li style="width: 9%">早退时长</li>
        <li style="width: 9%">工作时长</li>
        <li style="width: 9%">需补卡时长</li>
        <li style="width: 9%">加班时长</li>
        <li style="width: 9%">请假时长</li>
        <li style="width: 9%">出差时长</li>
        <li style="width: 9%">上班状态</li>
      </ul>
      <div class="pollution-warp">
        <ul
          v-for="(item, index) in detailList"
          :key="index"
          class="pollution-list"
        >
          <li style="width: 11%">{{ item.workDay }}</li>
          <li style="width: 9%">{{ item.workSign }}</li>
          <li style="width: 9%">{{ item.leaveSign }}</li>
          <li style="width: 9%">{{ item.lateHour }}</li>
          <li style="width: 9%">{{ item.earlyLeaveHour }}</li>
          <li style="width: 9%">{{ item.workDuration }}</li>
          <li style="width: 9%">{{ item.lackDuration }}</li>
          <li style="width: 9%">item.overwork</li>
          <li style="width: 9%">item.matters</li>
          <li style="width: 9%">item.businessTrip</li>
          <li
            style="width: 9%"
            :style="item.note === '正常' ? 'color:#33fc0e' : 'color:red'"
          >
            {{ item.note }}
          </li>
        </ul>
      </div>
    </div>

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
import { timeout } from "@/api/function";
import router from "@/router";

export default {
  name: "PersonalView",
  data() {
    return {
      selectMonth: "",
      detailList: [],
      lackHour: "", //截止当前日期所需要补卡总时长
      monthWorkDay: "", //当前月份出勤天数
      realWorkDay: "", //当前月份实际出勤天数
      workHour: "", //截止当前日期所统计考勤总时长
      workMonth: "", // 当月总时长
      weekDay: [
        // 转换星期
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
      snackbarStatue: false,
      snackbarType: "",
      snackbarMsg: "",
      Month: "",
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

.pollution-content {
  min-width: 1300px;
  height: 600px;
  margin: auto 0;
}

.pollution-content .pollution-top {
  list-style: none;
  height: 28px;
  font-size: 20px;
  font-weight: bold;
  color: #dde1e0;
  display: flex;
  line-height: 28px;
  border: 1px solid #81cfdb;
  background: rgba(129, 207, 219, 0.3);
}

.pollution-content .pollution-top li {
  text-align: center;
}

.pollution-warp {
  /*height: calc(80%);*/
  margin-top: 20px;
  overflow: auto;
}

.pollution-list {
  margin-top: 10px;
  width: 100%;
  height: 28px;
  font-size: 18px;
  color: #dde1e0;
  display: flex;
  line-height: 28px;
  /*cursor:default;*/
}

.pollution-list:hover {
  background: rgba(0, 132, 255, 0.2);
  border: 0 solid;
  box-shadow: rgb(0, 192, 255) 0 0 18px inset;
  border-image: linear-gradient(
      -90deg,
      rgba(0, 65, 167, 0.41),
      rgba(0, 192, 255, 0.41)
    )
    1 1;
}

.pollution-list li {
  text-align: center;
  overflow: hidden;
  /*省略号*/
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
