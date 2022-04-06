<template>
  <!--  <p>test</p>-->
  <div id="outer">
    test
    <v-row>
      <v-col class="d-flex" cols="12">
        <!--      <v-select :items="items" label="Outlined style" dense outlined></v-select>-->
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "PersonalView",
  data() {
    return {
      selectMonth: "",
      name: localStorage.getItem("loginName"),
      list: [],
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
    };
  },
  created() {},
  methods: {
    updateList() {},
  },
};
</script>

<style scoped>
#outer {
  margin: 50px auto;
  width: 80%;
  height: 80%;
  border: white 1px solid;
}
</style>
