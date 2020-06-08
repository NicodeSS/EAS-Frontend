<template>
  <employee-arrangement></employee-arrangement>
</template>

<script>
import EmployeeArrangement from "../components/EmployeeArrangement";
export default {
  name: "ArrangementShow",
  components: { EmployeeArrangement },
  data() {
    return {
      uId: 1
    };
  }
};
</script>

<style scoped></style>
