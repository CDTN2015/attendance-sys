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

    <div class="pollution-content">
      <ul class="pollution-top">
        <!--        <li style="width: 10%">姓名</li>-->
        <!--        <li style="width: 10%">当月实勤天数</li>-->
        <!--        <li style="width: 10%">当前工作时长</li>-->
        <!--        <li style="width: 10%">迟到时长</li>-->
        <!--        <li style="width: 10%">早退时长</li>-->
        <!--        <li style="width: 10%">当月请假时长</li>-->
        <!--        <li style="width: 10%">当月补班时长</li>-->
        <!--        <li style="width: 10%">当月出差时长</li>-->
        <!--        <li style="width: 20%">截止当前所需补卡时长</li>-->
        <li style="width: 2%">id</li>
        <li style="width: 8%">姓名</li>
        <li style="width: 15%">月度出勤天数</li>
        <li style="width: 15%">迟到时长</li>
        <li style="width: 15%">早退时长</li>
        <li style="width: 15%">请假时长</li>
        <li style="width: 15%">补班时长</li>
        <li style="width: 15%">还需加补班时长</li>
      </ul>
      <div class="pollution-warp">
        <!--        <vue-seamless-scroll :class-option="classOption" :data="detailList">-->
        <ul
          v-for="(item, index) in showList.slice(
            itemsPerPage * (page - 1),
            itemsPerPage * page
          )"
          :key="index"
          class="pollution-list"
        >
          <!--            <li style="width: 10%">{{ item.workDay }}</li>-->
          <!--            <li style="width: 9%">{{ item.workSign }}</li>-->
          <!--            <li style="width: 9%">{{ item.leaveSign }}</li>-->
          <!--            <li style="width: 9%">{{ item.lateHour }}</li>-->
          <!--            <li style="width: 9%">{{ item.earlyLeaveHour }}</li>-->
          <!--            <li style="width: 9%">{{ item.workDuration }}</li>-->
          <!--            <li style="width: 9%">{{ item.lackDuration }}</li>-->
          <!--            <li style="width: 9%">item.overwork</li>-->
          <!--            <li style="width: 9%">item.matters</li>-->
          <!--            <li style="width: 9%">item.businessTrip</li>-->
          <!--            <li-->
          <!--              style="width: 9%"-->
          <!--              :style="item.note === '正常' ? 'color:#33fc0e' : 'color:red'"-->
          <!--            >-->
          <!--              {{ item.note }}-->
          <!--            </li>-->
          <li style="width: 2%">{{ item.id ? item.id : "" }}</li>
          <li style="width: 8%">{{ item.name }}</li>
          <li style="width: 15%">{{ item.totalAttendanceDate }}</li>
          <li style="width: 15%">{{ item.totalLateMinutes }}</li>
          <li style="width: 15%">{{ item.totalEarlyLeaveMinutes }}</li>
          <li style="width: 15%">{{ item.totalLeaveMinutes }}</li>
          <li style="width: 15%">{{ item.totalWorkOvertime }}</li>
          <li style="width: 15%">{{ item.stillNeedExtraWork }}</li>
        </ul>
        <!--        </vue-seamless-scroll>-->
      </div>
    </div>
    <v-divider dark class="my-5"></v-divider>
    <v-row>
      <v-spacer></v-spacer>
      <!-- 表格分页 -->
      <v-col cols="3" v-if="page">
        <v-container class="d-flex justify-center">
          <v-btn
            elevation="2"
            outlined
            dark
            :disabled="page === 1"
            @click="page--"
          >
            <v-icon left> mdi-chevron-left</v-icon>
          </v-btn>
          <span class="mx-5" style="color: white"
            >第{{ page }}页，共{{ totalPage }}页</span
          >
          <v-btn
            elevation="2"
            outlined
            dark
            :disabled="page === totalPage"
            @click="page++"
          >
            <v-icon left> mdi-chevron-right</v-icon>
          </v-btn>
        </v-container>
      </v-col>
      <v-spacer></v-spacer>
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
// import vueSeamlessScroll from "vue-seamless-scroll";
import { axios } from "@/api/axiosConfig";
import router from "@/router";
import { timeout } from "@/api/function";

export default {
  name: "EmployeesView",
  data() {
    return {
      selectMonth: "",
      detailList: [],
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
      menu: false,
      // 每页记录条数
      itemsPerPage: 12,
      page: 0,
      totalPage: 0,
      showList: [],
    };
  },
  components: {
    // vueSeamlessScroll,
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
    classOption() {
      return {
        step: 0.9, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  methods: {
    async updateList() {
      try {
        // console.log(`查询月为: ${this.selectMonth}`);
        const response = await axios.get("/monthlyWorkAttendance/findByMonth", {
          params: {
            workMonth: this.selectMonth,
          },
        });
        console.log(response);
        this.snackbarStatue = true;
        if (response.data.code === 200) {
          this.snackbarMsg = "数据获取成功";
          this.snackbarType = "success";
          this.detailList = response.data.data;
          this.showList = this.detailList;
          this.fillShowList();
          // this.detailList = response.data.data.detailList;
          // this.lackHour = response.data.data.lackHour;
          // this.monthWorkDay = response.data.data.monthWorkDay;
          // this.realWorkDay = response.data.data.realWorkDay;
          // this.workHour = response.data.data.workHour;
          // this.workMonth = this.monthWorkDay * 8;
          // console.log(this.detailList);
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
    fillShowList() {
      this.totalPage = Math.ceil(this.showList.length / this.itemsPerPage);
      if (this.showList.length % this.itemsPerPage !== 0) {
        let tempItem = { id: 0, name: "", date: "", type: "", done: "" };
        for (
          let i = this.showList.length;
          i < this.totalPage * this.itemsPerPage;
          ++i
        ) {
          this.showList.push(tempItem);
        }
      }
      this.page = this.totalPage ? 1 : 0;
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

ul {
  padding: 0;
}

.pollution-content {
  min-width: 1300px;
}

.pollution-top {
  display: flex;
}

.pollution-content .pollution-top {
  list-style: none;
  height: 28px;
  font-size: 20px;
  font-weight: bold;
  color: #dde1e0;
  line-height: 28px;
  border: 1px solid #81cfdb;
  background: rgba(129, 207, 219, 0.3);
}

li {
  text-align: center;
}

li:not(:last-child) {
  border-right: rgba(129, 207, 219, 0.3) 1px solid;
}

.pollution-warp {
  height: 530px;
  overflow: scroll;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.pollution-list {
  margin-top: 15px;
  /*width: 100%;*/
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
