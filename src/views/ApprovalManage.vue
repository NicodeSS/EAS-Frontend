<template>
  <v-responsive>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :search="search"
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
          <v-btn class="mx-1" color="success" @click="batchAccept(selectedUids)"
            >批量接受</v-btn
          >
          <v-btn class="mx-1" color="error" @click="batchDecline(selectedUids)"
            >批量拒绝</v-btn
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="搜索"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="editItem(item)" class="mr-2">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)" class="mr-2">mdi-delete</v-icon>
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
      dialog_del: false,
      valid: true,
      loading: false,
      search: "",
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
        { text: "职位", value: "roleName" },
        { text: "操作", value: "actions" }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        uId: -1,
        name: "",
        departmentId: -1,
        departmentName: "",
        roleId: -1,
        roleName: ""
      },
      defaultItem: {
        uId: -1,
        name: "",
        departmentId: -1,
        departmentName: "",
        roleId: -1,
        roleName: ""
      },
      departments: [
        { id: 1, name: "销售部" },
        { id: 2, name: "售后部" },
        { id: 3, name: "维修部" }
      ],
      rules: {
        name: [v => !!v || "请输入姓名"],
        department: [v => (v && v !== -1) || "请选择部门"],
        role: [v => (v >= 0 && v <= 2) || "请选择职位"]
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新增员工" : "编辑员工";
    },
    roles() {
      if (this.$store.getters.userRole === 2)
        return [
          { name: "部门主管", id: 1 },
          { name: "员工", id: 0 }
        ];
      //TODO: restrict condition when login module works
      else return [{ name: "员工", id: 0 }];
    },
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
        let result = await this.$http.get("/staff/employee_list.do", {
          page: this.options.page,
          limit: this.options.itemsPerPage
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
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteItems(uids) {
      console.log(uids);
      let result = await this.$http.post("/staff/employee_delete", {
        uId: this.selectedUids
      });
      //TODO: realize delete employees
    },
    deleteItem(item) {
      confirm("确定要删除此用户吗?") && this.deleteItems([item.uId]);
    },
    excelImport() {
      //TODO: realize import employee from Excel
    },
    getNameById(list, id) {
      for (let item of list) {
        if (item.id === id) {
          return item.name;
        }
      }
      return "null";
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.editedItem.departmentName = this.getNameById(
        this.departments,
        this.editedItem.departmentId
      );
      this.editedItem.roleName = this.getNameById(
        this.roles,
        this.editedItem.roleId
      );
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.items.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

<style scoped></style>
