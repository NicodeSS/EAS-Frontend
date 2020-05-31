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
          <!--TODO：批量排班按钮-->
          <v-btn class="mx-1" color="teal" @click="batchArrange"
            >批量排班</v-btn
          >
          <!--TODO：临时加班按钮-->
          <v-btn class="mx-1" color="teal" @click="tempOverwork"
            >临时加班</v-btn
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
        <v-icon small @click="viewArrangement(item)" class="mr-2"
          >mdi-search</v-icon
        >
        <v-icon small @click="editArrangement(item)" class="mr-2"
          >mdi-pencil</v-icon
        >
      </template>
    </v-data-table>
  </v-responsive>
</template>

<script>
export default {
  name: "ArrangementManage",
  data() {
    return {
      snackbar: false,
      valid: true,
      loading: false,
      keyword: "",
      options: {
        page: 1,
        itemsPerPage: 15
      },
      totalCount: 0,
      selected: [],
      errorMessage: "",
      snackbarMsg: "",
      headers: [
        {
          text: "工号",
          align: "start",
          value: "uId"
        },
        { text: "姓名", value: "name" },
        { text: "部门", value: "departmentName" },
        { text: "职位", value: "roleName" },
        { text: "当前排班", value: "arrangement" },
        { text: "操作", value: "actions" }
      ],
      items: []
    };
  },
  computed: {
    selectedUids() {
      let uids = [];
      for (let item of this.selected) {
        uids.push(item.uId);
      }
      return uids;
    }
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      }
    },
    keyword: {
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
        let result = await this.$http.get("/staff/arrangement_list.do", {
          page: this.options.page,
          limit: this.options.itemsPerPage,
          keyword: this.keyword
        });
        this.totalCount = result.data.data.count;
        this.items = result.data.data.items;
      } catch (err) {
        this.items = [];
        this.errorMessage = err.data ? err.data.msg : "与服务器连接出错";
      } finally {
        this.loading = false;
      }
    },
    batchArrange() {},
    tempOverwork() {},
    viewArrangement() {},
    editArrangement() {}
  }
};
</script>

<style scoped></style>
