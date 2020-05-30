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
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1" color="primary" v-on="on">添加员工</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.uId"
                          label="工号"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.name"
                          :rules="rules.name"
                          label="姓名"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="editedItem.departmentId"
                          :items="departments"
                          item-text="name"
                          item-value="id"
                          :rules="rules.department"
                          label="部门"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="editedItem.roleId"
                          :items="roles"
                          item-text="name"
                          item-value="id"
                          :rules="rules.role"
                          label="职位"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                  :disabled="!valid"
                  >保存</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialog_del" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1" color="error" v-on="on">删除选定员工</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">删除员工</span>
              </v-card-title>
              <v-card-text>确定要删除员工吗？</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog_del = false"
                  >取消</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  @click="deleteItems(selectedUids)"
                  >确定</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn class="mx-1" color="teal" @click="excelImport"
            >Excel 导入</v-btn
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
  name: "EmployeeManage",
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
      if (this.$store.getters.userType === 2)
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
        let result = await this.$http.get("/test.json", {
          page: this.options.page,
          limit: this.options.itemsPerPage
        });
        this.totalCount = result.data.data.count;
        this.items = result.data.data.items;
      } catch (err) {
        this.items = [];
        this.errorMessage = err.data.msg ? err.data.msg : "与服务器连接出错";
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
