<template>
  <div class="table">
    <v-row class="mx-10">
      <v-col cols="6" sm="4" md="4" lg="2" class="mt-2 justify-center">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="query.date"
              label="日期"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              clearable
              dark
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="query.date"
            type="date"
            @input="setMonth"
            no-title
            scrollable
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="6" sm="4" md="4" lg="2" class="mt-2 justify-center">
        <v-text-field
          v-model="query.name"
          label="姓名"
          prepend-icon="mdi-account"
          clearable
          dark
        ></v-text-field>
      </v-col>
      <v-col cols="3" sm="2" md="2" lg="2" class="mt-2 justify-center">
        <v-select
          v-model="query.selectType"
          :items="items"
          label="事务类型"
          dark
        ></v-select>
      </v-col>
      <v-col cols="3" sm="2" md="2" lg="2" class="mt-2 justify-center">
        <v-checkbox
          id="pwd-checkbox"
          v-model="query.showWait"
          label="只看待办"
          dark
        ></v-checkbox>
      </v-col>
      <v-col cols="4" sm="4" md="2" lg="1" class="mt-4 justify-center">
        <v-btn
          elevation="2"
          block
          rounded
          :loading="load"
          color="white"
          @click="filter"
        >
          <v-icon left dark> mdi-filter-outline </v-icon>筛选
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-divider dark></v-divider>
      </v-col>
      <v-col cols="12">
        <v-card style="background-color: transparent">
          <v-simple-table style="background-color: transparent">
            <template v-slot:default>
              <thead>
                <tr id="header">
                  <th class="text-center">姓名</th>
                  <th class="text-center">日期</th>
                  <th class="text-center">待办事项</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in showList.slice(
                    itemsPerPage * (page - 1),
                    itemsPerPage * page
                  )"
                  :key="index"
                  :id="item.done ? 'data' : 'none'"
                >
                  <td class="text-center" style="width: 25%">
                    {{ item.name }}
                  </td>
                  <td class="text-center" style="width: 25%" v-if="item.done">
                    {{ item.date.slice(0, 4) }}年{{ item.date.slice(5, 7) }}月{{
                      item.date.slice(8)
                    }}日
                  </td>
                  <td
                    class="text-center"
                    style="width: 25%"
                    :style="
                      item.type === '忘记打卡'
                        ? 'color: #05d5ff'
                        : item.type === '加班'
                        ? 'color: chartreuse'
                        : 'color: orange'
                    "
                    v-if="item.done"
                  >
                    {{ item.type }}
                  </td>
                  <td class="text-center" style="width: 25%" v-if="item.done">
                    <v-btn
                      elevation="2"
                      rounded
                      @click="more(item)"
                      :color="item.done === 'accept' ? 'success' : 'primary'"
                    >
                      <v-icon left dark>{{
                        item.done === "accept"
                          ? "mdi-check"
                          : "mdi-dots-horizontal-circle-outline"
                      }}</v-icon
                      >{{ item.done === "accept" ? "查看" : "处理" }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
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
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="requestDialog" width="400" persistent>
      <HandleRequest v-on:closeDialog="closeDialog" />
    </v-dialog>

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
import HandleRequest from "@/components/HandleRequest";

export default {
  name: "BackEndView",
  data() {
    return {
      // 每页记录条数
      itemsPerPage: 10,
      page: 0,
      totalPage: 0,
      query: {
        name: "",
        date: "",
        selectType: "全部",
        showWait: false,
      },
      snackbarStatue: false,
      snackbarType: "",
      snackbarMsg: "",
      menu: false,
      load: false,
      items: ["全部", "请假", "加班", "忘记打卡"],
      // 原数据
      approvalList: [
        /*done: false, accept, refuse*/
        {
          id: 1,
          name: "jyc",
          date: "2022-03-08",
          type: "忘记打卡",
          done: "false",
        },
        {
          id: 2,
          name: "cdtn",
          date: "2022-05-08",
          type: "加班",
          done: "false",
        },
        { id: 3, name: "jyc", date: "2022-01-08", type: "请假", done: "false" },
        { id: 4, name: "jyc", date: "2022-03-20", type: "请假", done: "false" },
        { id: 5, name: "jyc", date: "2022-03-08", type: "请假", done: "false" },
        { id: 6, name: "jyc", date: "2022-03-08", type: "请假", done: "false" },
        { id: 7, name: "jyc", date: "2022-03-08", type: "请假", done: "false" },
        { id: 8, name: "jyc", date: "2022-03-08", type: "请假", done: "false" },
        { id: 9, name: "jyc", date: "2022-03-08", type: "请假", done: "false" },
        {
          id: 10,
          name: "jyc",
          date: "2022-03-08",
          type: "请假",
          done: "false",
        },
        {
          id: 11,
          name: "jyc12",
          date: "2022-03-08",
          type: "正常",
          done: "false",
        },
        {
          id: 12,
          name: "cdtn",
          date: "2022-03-20",
          type: "加班",
          done: "false",
        },
        {
          id: 13,
          name: "jyc",
          date: "2022-03-08",
          type: "请假",
          done: "false",
        },
        {
          id: 14,
          name: "jyc",
          date: "2022-03-08",
          type: "请假",
          done: "false",
        },
        {
          id: 15,
          name: "jyc",
          date: "2022-03-08",
          type: "请假",
          done: "false",
        },
        {
          id: 16,
          name: "jyc",
          date: "2022-03-08",
          type: "请假",
          done: "false",
        },
        {
          id: 17,
          name: "jyc",
          date: "2022-03-08",
          type: "请假",
          done: "false",
        },
        // {
        //   id: 18,
        //   name: "jyc",
        //   date: "2022-03-08",
        //   type: "请假",
        //   done: "false",
        // },
        // {
        //   id: 19,
        //   name: "jyc",
        //   date: "2022-03-08",
        //   type: "请假",
        //   done: "false",
        // },
      ],
      showList: [],
      requestDialog: false,
    };
  },
  components: { HandleRequest },
  mounted() {
    // this.query.date = new Date().toISOString().substring(0, 10);
    //this.updateList();
    // 获取原数据

    // 选择展示数据
    this.showList = this.approvalList;
    // 填充展示数据
    this.fillShowList();
  },
  computed: {},
  methods: {
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
    resetPage() {},
    async updateList() {
      // try {
      //   // console.log(`查询月为: ${this.selectMonth}`);
      //   const response = await axios.get("/workAttendance/list", {
      //     params: {
      //       workMonth: this.selectMonth,
      //     },
      //   });
      //   console.log(response);
      //   this.snackbarStatue = true;
      //   if (response.data.code === 200) {
      //     this.snackbarMsg = "数据获取成功";
      //     this.snackbarType = "success";
      //     this.detailList = response.data.data.detailList;
      //     this.lackHour = response.data.data.lackHour;
      //     this.monthWorkDay = response.data.data.monthWorkDay;
      //     this.realWorkDay = response.data.data.realWorkDay;
      //     this.workHour = response.data.data.workHour;
      //     this.workMonth = this.monthWorkDay * 8;
      //     console.log(this.detailList);
      //   } else {
      //     this.snackbarMsg = "数据获取失败，请重试";
      //     this.snackbarType = "error";
      //     await router.push({
      //       path: "/",
      //     });
      //   }
      //   await timeout(2000);
      //   this.snackbarStatue = false;
      // } catch (error) {
      //   console.error(error);
      // }
    },
    setMonth() {
      this.menu = false;
      //this.updateList();
    },
    hasName(item) {
      return item.name.indexOf(this.query.name) > -1;
    },
    hasDate(item) {
      return item.date === this.query.date;
    },
    onlyWait(item) {
      return item.done === "false";
    },
    hasType(item) {
      return item.type === this.query.selectType;
    },
    async filter() {
      console.log(this.query.date, this.query.name);
      this.load = true;
      // await timeout(3000);
      this.showList = this.query.name
        ? this.approvalList.filter(this.hasName)
        : this.approvalList;
      this.showList = this.query.date
        ? this.showList.filter(this.hasDate)
        : this.showList;
      this.showList = this.query.showWait
        ? this.showList.filter(this.onlyWait)
        : this.showList;
      this.showList =
        this.query.selectType !== "全部"
          ? this.showList.filter(this.hasType)
          : this.showList;
      this.fillShowList();
      this.load = false;
    },
    async more(item) {
      this.requestDialog = true;
      await timeout(3000);
      item.done = "accept";
    },
    closeDialog() {
      this.requestDialog = false;
    },
  },
};
</script>

<style scoped>
.table {
  margin: 50px auto;
  width: 90%;
  background-color: rgba(36, 43, 95, 0.2);
}

#header th,
#data td {
  font-size: 20px;
  color: #dde1e0;
  line-height: 28px;
}

#data:hover {
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
#none:hover {
  background-color: transparent;
}
</style>
