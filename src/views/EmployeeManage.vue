<template>
  <v-responsive>
    <!-- 消息条 -->
    <v-snackbar v-model="snackbar">
      {{ snackbarMsg }}
      <v-btn color="primary" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <!-- 数据表格 -->
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
      <!-- 顶部工具栏 -->
      <template v-slot:top>
        <v-toolbar flat>
          <!-- 添加员工对话框 -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1" color="primary" v-on="on">添加员工</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ dialogTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.uId"
                          label="工号"
                          :rules="rules.uid"
                          required
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

          <!-- 删除员工对话框 -->
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

          <!-- Excel导入对话框 -->
          <v-dialog v-model="dialog_import" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1" color="teal" v-on="on">Excel 导入</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Excel 导入</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form>
                    <v-row>
                      <v-col cols="12">
                        <v-file-input
                          v-model="file"
                          accept=".xlsx,.xls"
                          label="File input"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog_import = false"
                  >取消</v-btn
                >
                <v-btn color="blue darken-1" text @click="excelImport"
                  >确定</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-divider class="mx-4" inset vertical></v-divider>

          <!-- 添加部门 -->
          <v-dialog v-model="dialog_depart" max-width="500px" v-if="isBoss">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1" color="teal" v-on="on">添加部门</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">添加部门</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-text-field v-model="departmentAddName" label="部门名称">
                  </v-text-field>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog_depart = false"
                  >取消</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  @click="addDepartment"
                  :disabled="!departmentAddName"
                  >确定</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>

          <!-- 搜索框 -->
          <v-text-field
            v-model="keyword"
            append-icon="mdi-magnify"
            label="搜索"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>

      <!-- 操作项 -->
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
      dialog_import: false,
      dialog_depart: false,

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
        { text: "职位", value: "roleName" },
        { text: "操作", value: "actions" }
      ],
      items: [],

      editedIndex: -1,
      editedItem: {
        uId: "",
        name: "",
        departmentId: -1,
        departmentName: "",
        roleId: -1,
        roleName: ""
      },
      defaultItem: {
        uId: "",
        name: "",
        departmentId: -1,
        departmentName: "",
        roleId: -1,
        roleName: ""
      },
      departments: [],
      file: [],
      rules: {
        uid: [v => v.length >= 4 || "工号至少4位字符"],
        name: [v => !!v || "请输入姓名"],
        department: [v => (v && v !== -1) || "请选择部门"],
        role: [v => (v >= 0 && v <= 2) || "请选择职位"]
      },
      valid: true,

      departmentAddName: ""
    };
  },
  computed: {
    // 对话框标题
    dialogTitle() {
      return this.editedIndex === -1 ? "新增员工" : "编辑员工";
    },
    // 根据当前登陆角色判断是否可以任命部门主管
    roles() {
      if (this.$store.getters.userRole === 2)
        return [
          { name: "部门主管", id: 1 },
          { name: "员工", id: 0 }
        ];
      else if (this.$store.getters.userRole === 1)
        return [{ name: "员工", id: 0 }];
      else return [];
    },
    isBoss() {
      return this.$store.getters.userRole === 2;
    },
    // 表格中选中项的Uid列表
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
        this.getEmployees();
      }
    },
    keyword: {
      handler() {
        this.getEmployees();
      }
    },
    deep: true,
    dialog(val) {
      val || this.close();
    }
  },
  mounted() {
    this.getEmployees();
  },
  methods: {
    // 获取员工列表
    async getEmployees() {
      this.loading = true;
      try {
        if (this.departments.length === 0) {
          let dresult = await this.$http.get("/manager/department_list.do");
          this.departments = dresult.data.data.items;
        }
        let result = await this.$http.get("/staff/employee_list.do", {
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
    // 编辑员工信息
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    // 批量删除员工
    async deleteItems(uids) {
      try {
        let result = await this.$http.post("/staff/employee_delete.do", {
          uId: uids
        });
        this.snackbarMsg = result.data.msg;
        this.snackbar = true;
        for (let uid of uids)
          for (let i = 0; i < this.items.length; i++)
            if (this.items[i].uId === uid) this.items.splice(i, 1);
      } catch (err) {
        this.snackbarMsg = err.data ? err.data.msg : "删除失败，服务器错误";
        this.snackbar = true;
      } finally {
        this.dialog_del = false;
      }
    },
    // 删除员工
    deleteItem(item) {
      confirm("确定要删除员工 " + item.name + " 吗?") &&
        this.deleteItems([item.uId]);
    },
    // Excel导入
    async excelImport() {
      let formData = new FormData();
      formData.append("file", this.file);
      try {
        let result = await this.$http.post(
          "/staff/bulk_employee_add.do",
          formData
        );
        this.snackbarMsg = result.data.msg;
        this.snackbar = true;
      } catch (err) {
        this.snackbarMsg = err.data ? err.data.msg : "导入失败，服务器错误";
        this.snackbar = true;
      } finally {
        this.file = [];
        this.dialog_import = false;
      }
    },
    // 用部门id获取部门名称
    getNameById(list, id) {
      for (let item of list) {
        if (item.id === id) {
          return item.name;
        }
      }
      return "null";
    },
    // 新建/编辑对话框 - 关闭
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    // 新建/编辑对话框 - 保存
    async save() {
      try {
        let url =
          this.editedIndex === -1
            ? "/staff/employee_add.do"
            : "/staff/employee_edit.do";
        let result = await this.$http.post(url, this.editedItem);
        this.snackbarMsg = result.data.msg;
        this.snackbar = true;

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
      } catch (err) {
        console.error(err);
        this.snackbarMsg = err.data ? err.data.msg : "操作失败";
        this.snackbar = true;
      }
    },
    async addDepartment() {
      try {
        let result = await this.$http.post("/manager/department_add.do", {
          name: this.departmentAddName
        });
        this.snackbarMsg = result.data.msg;
        this.departmentAddName = "";
        this.dialog_depart = false;
      } catch (err) {
        this.snackbarMsg = err.data ? err.data.msg : "添加失败，服务器错误";
      } finally {
        this.snackbar = true;
      }
    }
  }
};
</script>

<style scoped></style>
