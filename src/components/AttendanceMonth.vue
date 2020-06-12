<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-key="uId"
    :loading="loading"
    loading-text="Loading... Please wait."
    :no-data-text="errMsg"
    :options.sync="options"
    :server-items-length="totalCount"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-row align="center" justify="center">
          <v-col cols="3">
            <v-select
              v-if="isBoss"
              v-model="departmentId"
              :items="departments"
              item-text="name"
              item-value="id"
              label="部门"
              outlined
              hide-details
              dense
            ></v-select>
          </v-col>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="keyword"
            append-icon="mdi-magnify"
            label="搜索"
            single-line
            hide-details
          ></v-text-field>
        </v-row>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "AttendanceMonth",
  data() {
    return {
      departmentId: -1,
      departments: [{ id: -1, name: "请选择" }],

      loading: false,
      options: {
        page: 1,
        itemsPerPage: 15
      },
      keyword: "",
      headers: [
        { value: "uId", text: "工号", align: "start" },
        { value: "name", text: "姓名" },
        { value: "departmentName", text: "部门" },
        { value: "role", text: "职位" },
        { value: "allShift", text: "应到" },
        { value: "beShift", text: "实到" },
        { value: "leave", text: "请假" },
        { value: "absenteeism", text: "缺勤" },
        { value: "overtime", text: "加班" },
        { value: "workTime", text: "工时" },
        { value: "overWorkTime", text: "加班时长" },
        { value: "holidayWorkTime", text: "节假日工时" }
      ],
      totalCount: 0,
      items: [],
      errMsg: "无数据"
    };
  },
  computed: {
    isBoss() {
      return this.$store.getters.userRole === 2;
    }
  },
  watch: {
    departmentId: {
      handler() {
        this.getOverview();
      }
    },
    options: {
      handler() {
        this.getOverview();
      }
    },
    keyword: {
      handler() {
        this.getOverview();
      }
    }
  },
  created() {
    if (this.isBoss) this.getDepartments();
  },
  mounted() {
    this.getOverview();
  },
  methods: {
    async getOverview() {
      this.loading = true;
      try {
        let result = await this.$http.get("/manager/attendance_list.do", {
          page: this.options.page,
          limit: this.options.itemsPerPage,
          departmentId: this.departmentId,
          keyword: this.keyword
        });
        console.log(result.data);
        this.totalCount = result.data.data.count;
        this.items = result.data.data.items;
      } catch (err) {
        this.items = [];
        this.errMsg = err.data ? err.data.msg : "与服务器连接出错";
      } finally {
        this.loading = false;
      }
    },
    async getDepartments() {
      if (this.departments.length <= 1) {
        try {
          let result = await this.$http.get("/manager/department_list.do");
          this.departments = result.data.data.items;
          this.departments.push({ id: -1, name: "请选择" });
        } catch (err) {
          console.error(err);
          this.departments = [{ id: -1, name: "请选择" }];
          this.departmentId = -1;
        }
      }
    }
  }
};
</script>

<style scoped></style>
