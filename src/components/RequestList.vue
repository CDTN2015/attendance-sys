<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date.start"
                :label="
                  type !== '忘记打卡' ? `${type}开始日期` : '忘记打卡日期'
                "
                :prepend-icon="
                  type !== '忘记打卡'
                    ? 'mdi-calendar-start'
                    : 'mdi-calendar-blank'
                "
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date.start"
              @input="changeDate"
              no-title
              scrollable
              :min="date.minStart"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col clos="6">
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time.start"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="time.start"
                :label="
                  type !== '忘记打卡' ? `${type}开始时间` : '忘记打卡时间'
                "
                :prepend-icon="
                  type !== '忘记打卡' ? 'mdi-clock-start' : 'mdi-clock-outline'
                "
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="time.start"
              :allowed-minutes="allowedMinutes"
              @click:minute="$refs.menu2.save(time.start)"
              :max="time.max"
              :min="time.min"
              landscape
              format="24hr"
              scrollable
            ></v-time-picker>
          </v-menu>
        </v-col>
        <template v-if="type !== '忘记打卡'">
          <v-col cols="6">
            <v-menu
              v-model="menu3"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date.end"
                  :label="`${type}结束日期`"
                  prepend-icon="mdi-calendar-end"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date.end"
                @input="menu3 = false"
                no-title
                scrollable
                :min="date.start"
              >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col clos="6">
            <v-menu
              ref="menu4"
              v-model="menu4"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time.end"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="time.end"
                  :label="`${type}结束时间`"
                  prepend-icon="mdi-clock-end"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu4"
                v-model="time.end"
                :allowed-minutes="allowedMinutes"
                @click:minute="$refs.menu4.save(time.end)"
                :max="time.max"
                :min="date.start === date.end ? time.start : time.min"
                landscape
                format="24hr"
                scrollable
              ></v-time-picker>
            </v-menu>
          </v-col>
        </template>
        <v-col cols="12"> </v-col>
      </v-row>
      <v-textarea
        v-model="reason"
        v-if="type !== '忘记打卡'"
        class="mt-6 mb-n10"
        :label="`${type}事由`"
        auto-grow
        outlined
        counter
      ></v-textarea>
    </v-container>
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
// import { timeout } from "@/api/function";
export default {
  name: "AskForLeave",
  props: ["type"],
  data() {
    return {
      date: {
        start: "",
        minStart: "",
        end: "",
      },
      date1: "",
      time: {
        start: "08:30",
        end: "08:30",
        max: "22:00",
        min: "8:30",
      },
      datetime: {
        start: "",
        end: "",
      },
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      reason: "",
      snackbarStatue: false,
      snackbarMsg: "",
      snackbarType: "info",
    };
  },
  created() {
    console.log(this.type);
    let temp = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substring(0, 10);
    [this.date.start, this.date.minStart, this.date.end] = [temp, temp, temp];
  },
  methods: {
    changeDate() {
      this.menu1 = false;
      if (this.date.start > this.date.end) {
        this.date.end = this.date.start;
      }
    },
    allowedMinutes: (v) => !(v % 15),
    async submit() {
      console.log(
        this.type === "忘记打卡"
          ? `${this.date.start}_${this.time.start}补卡`
          : `从${this.date.start}_${this.time.start}到${this.date.end}_${this.time.end}${this.type}`
      );
      let param = {
        startTime: `${this.date.start} ${this.time.start}:00`,
        endTime: `${this.date.end} ${this.time.end}:00`,
        incident: this.reason,
        state: "2",
      };
      let a = new Date(param.startTime);
      console.log(a);

      console.log(param);
      try {
        const response = await axios.post("/state/insert", param);
        console.log(response);
      } catch (error) {
        console.error(error);
      }

      this.snackbarStatue = true;
      this.snackbarMsg = "提交成功";
      this.snackbarType = "success";
      return true;
      // if (
      //   this.date.start === this.date.end &&
      //   this.time.start === this.time.end
      // ) {
      //   alert("请选择有效时间段");
      //   return false;
      // } else {
      //   this.snackbarStatue = true;
      //   this.snackbarMsg = "提交成功";
      //   this.snackbarType = "success";
      //   return true;
      // }
      // if (false) {
      //   this.snackbarMsg = `提交失败`;
      //   this.snackbarType = "error";
      //   return false;
      // } else {
      //   this.snackbarMsg = "提交成功";
      //   this.snackbarType = "success";
      //   return true;
      // }
    },
  },
};
</script>

<style scoped></style>
