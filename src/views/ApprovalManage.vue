<template>
  <v-responsive>
    <v-snackbar v-model="snackbar">
      {{ snackbarMsg }}
      <v-btn color="primary" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      item-key="uId"
      :loading="loading"
      loading-text="Loading... Please wait."
      :no-data-text="errorMessage"
      :options.sync="options"
      :server-items-length="totalCount"
      show-select
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn class="mx-1" color="success" @click="submit(selectedIds, 1)"
            >批量接受</v-btn
          >
          <v-btn class="mx-1" color="error" @click="submit(selectedIds, 0)"
            >批量拒绝</v-btn
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="keyword"
            append-icon="mdi-magnify"
            label="搜索"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon @click="submit([item.id], 1)" class="mr-2">mdi-check</v-icon>
        <v-icon @click="submit([item.id], 0)" class="mr-2"
          >mdi-file-excel-box-outline</v-icon
        >
      </template>
    </v-data-table>
  </v-responsive>
</template>

<script>
export default {
  name: "ApprovalManage",
  data() {
    return {
      dialog: false,
      snackbar: false,
      snackbarMsg: "",
      loading: false,
      keyword: "",
      options: {
        page: 1,
        itemsPerPage: 15
      },
      totalCount: 0,
      selected: [],
      errorMessage: "",
      headers: [
        {
          text: "工号",
          align: "start",
          value: "uId"
        },
        { text: "姓名", value: "name" },
        { text: "部门", value: "departmentName" },
        { text: "类型", value: "type" },
        { text: "时间", value: "time" },
        { text: "描述", value: "description" },
        { text: "操作", value: "actions" }
      ],
      items: []
    };
  },
  computed: {
    selectedIds() {
      let ids = [];
      for (let item of this.selected) {
        ids.push(item.id);
      }
      return ids;
    }
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      }
    },
    deep: true,
    dialog(val) {
      val || this.close();
    }
  },
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    async getDataFromApi() {
      this.loading = true;
      try {
        // let result = await this.$http.get("/event/event_list.do", {
        //   page: this.options.page,
        //   limit: this.options.itemsPerPage,
        //   keyword: this.keyword
        // });
        let result = this.testData();
        console.log(result);
        this.totalCount = result.data.data.count;
        this.items = result.data.data.events;
      } catch (err) {
        console.log(err);
        this.items = [];
        this.errorMessage = err.data ? err.data.msg : "与服务器连接出错";
      } finally {
        this.loading = false;
      }
    },
    testData() {
      return {
        data: {
          status: 0,
          msg: "",
          data: {
            count: 1,
            events: [
              {
                id: 1,
                uId: "DepartmentManager1",
                name: "DM1",
                departmentName: "销售部",
                type: "请假",
                time: "2020-09-28 10:00 - 2022-04-29 05:00",
                description: "生病了"
              }
            ]
          }
        }
      };
    },
    async submit(ids, action) {
      if (!ids.length) return;
      try {
        let result = await this.$http.post("/event/event_check.do", {
          ids: ids,
          action: action
        });
        this.snackbarMsg = result.data.msg;
        this.snackbar = true;
      } catch (err) {
        console.log(err);
        this.snackbarMsg = err.data ? err.data.msg : "审批失败：服务器错误";
        this.snackbar = true;
      }
    }
  }
};
</script>

<style scoped></style>
