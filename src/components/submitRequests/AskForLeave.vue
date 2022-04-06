<template>
  <v-container>
    <p>AskForLeave</p>
    <v-row>
      <v-col cols="12">
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
              label="请假开始日期"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date.start"
            @input="changeStartDate"
            no-title
            scrollable
            :min="date.minStart"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col clos="12">
        <v-menu
          ref="menu"
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="Time.start"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="Time.start"
              label="Picker in menu"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menu2"
            v-model="Time.start"
            :allowed-minutes="allowedMinutes"
            @click:minute="$refs.menu.save(Time.start)"
            landscape
            format="24hr"
            scrollable
          ></v-time-picker>
        </v-menu>
      </v-col>
      <v-col cols="12">
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
              label="请假结束日期"
              prepend-icon="mdi-calendar"
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
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AskForLeave",
  data() {
    return {
      date: {
        start: "",
        minStart: "",
        end: "",
      },
      Time: {
        start: "",
        minStart: "",
        end: "",
      },
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
    };
  },
  created() {
    let temp = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substring(0, 10);
    [this.date.start, this.date.minStart, this.date.end] = [temp, temp, temp];
  },
  methods: {
    changeStartDate() {
      this.menu1 = false;
      if (this.date.start > this.date.end) {
        this.date.end = this.date.start;
      }
    },
    changeStartTime() {},
    allowedMinutes: (v) => !(v % 15),
  },
};
</script>

<style scoped></style>
