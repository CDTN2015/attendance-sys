<template>
  <div class="table">
    <v-row class="mx-10">
      <v-col cols="6" sm="4" md="4" lg="3" class="mt-2 justify-center">
        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="query.date"
              label="查询日期"
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
      <v-col cols="6" sm="4" md="4" lg="3" class="mt-2 justify-center">
        <v-text-field
          v-model="query.name"
          label="查询姓名"
          prepend-icon="mdi-account"
          clearable
          dark
        ></v-text-field>
      </v-col>
      <v-col cols="4" sm="4" md="2" lg="1" class="mt-4 justify-center">
        <v-btn
          elevation="2"
          block
          rounded
          :loading="load"
          color="white"
          @click="search"
        >
          <v-icon left dark> mdi-magnify </v-icon>查询
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-divider dark></v-divider>
      </v-col>
      <v-col cols="12">
        <v-simple-table dark style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr id="header">
                <th>姓名</th>
                <th>日期</th>
                <th>待办事项</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in approvalList" :key="item.name" id="data">
                <td style="width: 30%; min-width: 150px">{{ item.name }}</td>
                <td style="width: 30%; min-width: 200px">{{ item.date }}</td>
                <td
                  style="width: 30%; min-width: 200px"
                  :style="
                    item.type === '正常'
                      ? 'color: #05d5ff'
                      : item.type === '加班'
                      ? 'color: chartreuse'
                      : 'color: orange'
                  "
                >
                  {{ item.type }}
                </td>
                <td style="width: 10%; min-width: 50px">
                  <v-btn
                    elevation="2"
                    block
                    rounded
                    @click="more(item)"
                    :color="item.done === 'accept' ? 'success' : 'primary'"
                  >
                    <v-icon left light>{{
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
import { axios } from "@/api/axiosConfig";
import router from "@/router";
import { timeout } from "@/api/function";
import HandleRequest from "@/components/HandleRequest";

export default {
  name: "BackEndView",
  data() {
    return {
      query: {
        name: "",
        date: "",
      },
      snackbarStatue: false,
      snackbarType: "",
      snackbarMsg: "",
      menu1: false,
      menu2: false,
      load: false,
      approvalList: [
        /*done: false, accept, refuse*/
        { id: 1, name: "jyc", date: "march 2003", type: "正常", done: "false" },
        { id: 2, name: "cdtn", date: "may 2235", type: "加班", done: "false" },
        { id: 3, name: "jyc", date: "march 2003", type: "请假", done: "false" },
        { id: 4, name: "jyc", date: "march 2003", type: "请假", done: "false" },
        { id: 5, name: "jyc", date: "march 2003", type: "请假", done: "false" },
        { id: 6, name: "jyc", date: "march 2003", type: "请假", done: "false" },
        { id: 7, name: "jyc", date: "march 2003", type: "请假", done: "false" },
        { id: 8, name: "jyc", date: "march 2003", type: "请假", done: "false" },
        { id: 9, name: "jyc", date: "march 2003", type: "请假", done: "false" },
      ],
      requestDialog: false,
    };
  },
  components: { HandleRequest },
  created() {
    this.query.date = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substring(0, 10);
    //this.updateList();
  },
  computed: {},
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
      //this.updateList();
    },
    async search() {
      this.load = true;
      await timeout(3000);
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
  height: 80%;
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
</style>
