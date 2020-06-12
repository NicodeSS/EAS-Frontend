<template>
  <v-card>
    <v-tabs v-model="tab" color="primary" dark>
      <v-tab :href="'#tab-1'">日视图</v-tab>
      <v-tab :href="'#tab-2'">月视图</v-tab>

      <v-tab-item :value="'tab-1'">
        <attendance-day></attendance-day>
      </v-tab-item>

      <v-tab-item :value="'tab-2'">
        <attendance-month></attendance-month>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import AttendanceDay from "../components/AttendanceDay";
import AttendanceMonth from "../components/AttendanceMonth";

export default {
  name: "AttendanceManage",
  components: {
    AttendanceMonth: AttendanceMonth,
    AttendanceDay: AttendanceDay
  },
  data() {
    return {
      tab: null
    };
  }
};
</script>

<style scoped></style>
