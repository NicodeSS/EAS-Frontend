<template>
  <v-responsive>
    <v-snackbar v-model="snackbar">
      {{ snackbarMsg }}
      <v-btn color="primary" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
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
          <v-btn class="mx-1" color="teal" @click="batchArrange"
            >批量排班</v-btn
          >
          <!--TODO：临时加班按钮-->
          <v-btn v-if="isBoss" class="mx-1" color="teal" @click="tempOverwork"
            >临时加班</v-btn
          >

          <v-dialog v-model="dialog_arr" persistent max-width="1000px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ dialog_arr_title }}</span>
              </v-card-title>
              <v-card-text>
                <v-select
                  v-if="batchEnabled"
                  v-model="selectedEmployees"
                  :items="employees"
                  attach
                  chips
                  label="需排班的员工"
                  multiple
                ></v-select>
              </v-card-text>
              <v-tabs v-model="tab" color="primary" dark>
                <v-tab :href="'#tab-1'">直接编辑</v-tab>
                <v-tab :href="'#tab-2'">模版导入</v-tab>

                <v-tab-item :value="'tab-1'">
                  <v-card-text>
                    <v-container>
                      <v-dialog
                        v-model="dialog_shift"
                        persistent
                        max-width="800px"
                      >
                        <v-card>
                          <v-card-title>
                            <span class="headline">班次修改</span>
                          </v-card-title>
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-btn-toggle v-model="shiftNumber">
                                  <v-btn text>
                                    休息
                                  </v-btn>
                                  <v-btn text>
                                    一天一班
                                  </v-btn>
                                  <v-btn text>
                                    一天两班
                                  </v-btn>
                                  <v-btn text>
                                    一天三班
                                  </v-btn>
                                </v-btn-toggle>
                              </v-row>
                              <div v-for="n in shiftNumber" :key="n">
                                <v-row>
                                  <v-col cols="6">
                                    <v-menu
                                      ref="menu"
                                      v-model="menu[2 * n - 1]"
                                      :close-on-content-click="false"
                                      :nudge-right="40"
                                      transition="scale-transition"
                                      offset-y
                                      max-width="290px"
                                      min-width="290px"
                                    >
                                      <template v-slot:activator="{ on }">
                                        <v-text-field
                                          v-model="time[2 * n - 1]"
                                          :label="'第' + n + '次上班时间'"
                                          prepend-icon="access_time"
                                          readonly
                                          v-on="on"
                                        ></v-text-field>
                                      </template>
                                      <v-time-picker
                                        v-if="menu[2 * n - 1]"
                                        v-model="time[2 * n - 1]"
                                        :max="time[2 * n]"
                                        format="24hr"
                                        full-width
                                      ></v-time-picker>
                                    </v-menu>
                                  </v-col>
                                  <v-col cols="6">
                                    <v-menu
                                      ref="menu"
                                      v-model="menu[2 * n]"
                                      :close-on-content-click="false"
                                      :nudge-right="40"
                                      transition="scale-transition"
                                      offset-y
                                      max-width="290px"
                                      min-width="290px"
                                    >
                                      <template v-slot:activator="{ on }">
                                        <v-text-field
                                          v-model="time[2 * n]"
                                          :label="'第' + n + '次下班时间'"
                                          prepend-icon="access_time"
                                          readonly
                                          v-on="on"
                                        ></v-text-field>
                                      </template>
                                      <v-time-picker
                                        v-if="menu[2 * n]"
                                        v-model="time[2 * n]"
                                        :min="time[2 * n - 1]"
                                        format="24hr"
                                        full-width
                                      ></v-time-picker>
                                    </v-menu>
                                  </v-col>
                                </v-row>
                              </div>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="cancelShift"
                              >取消</v-btn
                            >
                            <v-btn
                              :disabled="!shiftAvailable"
                              color="blue darken-1"
                              text
                              @click="saveShift"
                              >确定</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <v-data-table
                        :headers="headers_arr"
                        :items="items_arr"
                        :loading="loading_arr"
                        item-key="day"
                        loading-text="Loading... Please wait."
                        :no-data-text="errMsg_arr"
                        hide-default-footer
                      >
                        <template v-slot:item.actions="{ item }">
                          <v-btn color="primary" text @click="editShift(item)">
                            更改班次
                          </v-btn>
                        </template>
                      </v-data-table>
                      <v-row align="center" justify="center">
                        <v-col cols="3">
                          <v-text-field
                            v-model="tmpName"
                            label="模版名"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2">
                          <v-btn :disabled="!valid" @click="saveTemplate"
                            >保存为模版</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="dialog_arr = false"
                      >取消</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="saveArrangement"
                      >保存</v-btn
                    >
                  </v-card-actions>
                </v-tab-item>

                <v-tab-item :value="'tab-2'">
                  <v-card-text>
                    <v-container>
                      <v-data-table
                        :headers="headers_tmp"
                        :items="items_tmp"
                        :loading="loading_tmp"
                        item-key="name"
                        loading-text="Loading... Please wait."
                        :no-data-text="errMsg_tmp"
                        hide-default-footer
                      >
                        <template v-slot:item.actions="{ item }">
                          <v-btn
                            color="primary"
                            text
                            @click="applyTemplate(item)"
                          >
                            应用模版
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-container>
                  </v-card-text>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-dialog>

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
          >mdi-table-search</v-icon
        >
        <v-icon small @click="editArrangement(item)" class="mr-2"
          >mdi-table-edit</v-icon
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
      tab: null,
      dialog_arr: false,
      dialog_shift: false,
      snackbar: false,
      snackbarMsg: "",
      tmpName: "",
      batchEnabled: false,
      selectedEmployees: [],
      employees: [
        "t1",
        "t2",
        "t3",
        "t4",
        "t5",
        "t6",
        "t7",
        "t1",
        "t2",
        "t3",
        "t4",
        "t5",
        "t6",
        "t7"
      ],
      defaultArrangement: [
        { times: 0 },
        { times: 0 },
        { times: 0 },
        { times: 0 },
        { times: 0 },
        { times: 0 },
        { times: 0 }
      ],

      loading: false,
      totalCount: 0,
      keyword: "",
      options: {
        page: 1,
        itemsPerPage: 15
      },
      headers: [
        {
          text: "工号",
          align: "start",
          value: "uId"
        },
        { text: "姓名", value: "name" },
        { text: "部门", value: "departmentName" },
        { text: "职位", value: "roleName" },
        { text: "当前排班", value: "currentArrangement" },
        { text: "操作", value: "actions" }
      ],
      items: [],
      errMsg: "",

      loading_arr: false,
      headers_arr: [
        {
          text: "工作日",
          align: "start",
          value: "day"
        },
        { text: "班次时间段", value: "duration" },
        { text: "操作", value: "actions" }
      ],
      items_arr: [],
      errMsg_arr: "NoData",

      loading_tmp: false,
      headers_tmp: [
        {
          text: "模版名",
          align: "start",
          value: "name"
        },
        { text: "操作", value: "actions" }
      ],
      items_tmp: [],
      errMsg_tmp: "NoData",

      arrData: [],
      editItem: null,
      shiftIndex: -1,
      shiftNumber: 0,
      time: [null, null, null, null, null, null, null, null],
      menu: [false, false, false, false, false, false, false]
    };
  },
  computed: {
    valid() {
      return this.tmpName.length;
    },
    shiftAvailable() {
      if (!this.shiftNumber) return true;
      for (let i = 1; i <= 2 * this.shiftNumber; i++)
        if (!this.time[i]) return false;
      return true;
    },
    isBoss() {
      return this.$store.getters.userRole === 2;
    },
    dialog_arr_title() {
      return this.batchEnabled ? "批量排班" : "排班";
    }
  },
  watch: {
    arrData: {
      handler() {
        this.items_arr = this.parseData(this.arrData);
      }
    },
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
    deep: true
  },
  mounted() {
    this.getEmployees();
  },
  methods: {
    async getEmployees() {
      this.loading = true;
      try {
        let result = await this.$http.get("/staff/employee_list.do", {
          page: this.options.page,
          limit: this.options.itemsPerPage,
          keyword: this.keyword
        });
        this.totalCount = result.data.data.count;
        this.items = result.data.data.items;
      } catch (err) {
        this.items = [];
        this.errMsg = err.data ? err.data.msg : "与服务器连接出错";
      } finally {
        this.loading = false;
      }
    },
    getTestData() {
      return [
        {
          times: 3,
          durations: ["08:00-12:00", "13:00-17:00", "18:00-22:00"]
        },
        { times: 2, durations: ["08:00-12:00", "13:00-17:00"] },
        { times: 1, durations: ["08:00-20:00"] },
        { times: 2, durations: ["08:00-12:00", "13:00-17:00"] },
        {
          times: 3,
          durations: ["08:00-12:00", "13:00-17:00", "18:00-22:00"]
        },
        { times: 0, durations: [] },
        { times: 0, durations: [] }
      ];
    },
    getTestTmp() {
      return [
        {
          name: "测试模版1",
          template: [
            {
              times: 3,
              durations: ["08:00-12:00", "13:00-17:00", "18:00-22:00"]
            },
            { times: 2, durations: ["08:00-12:00", "13:00-17:00"] },
            { times: 1, durations: ["08:00-20:00"] },
            { times: 2, durations: ["08:00-12:00", "13:00-17:00"] },
            {
              times: 3,
              durations: ["08:00-12:00", "13:00-17:00", "18:00-22:00"]
            },
            { times: 0, durations: [] },
            { times: 0, durations: [] }
          ]
        },
        {
          name: "测试模版2",
          template: [
            {
              times: 3,
              durations: ["08:00-12:00", "13:00-17:00", "18:00-22:00"]
            },
            { times: 2, durations: ["08:00-12:00", "13:00-17:00"] },
            { times: 1, durations: ["08:00-20:00"] },
            { times: 2, durations: ["08:00-12:00", "13:00-17:00"] },
            {
              times: 3,
              durations: ["08:00-12:00", "13:00-17:00", "18:00-22:00"]
            },
            { times: 0, durations: [] },
            { times: 0, durations: [] }
          ]
        }
      ];
    },
    parseData(data) {
      let newData = [];
      let week = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      for (let i in data) {
        let temp = {};
        temp.day = week[i];
        temp.duration = "";
        if (data[i].times)
          for (let j of data[i].durations) {
            temp.duration += j;
            temp.duration += " ";
          }
        else temp.duration = "休息";
        newData.push(temp);
      }
      return newData;
    },
    batchArrange() {
      this.batchEnabled = true;
      this.arrData = this.defaultArrangement;
      this.items_arr = this.parseData(this.arrData);
      if (this.items_tmp.length === 0) {
        this.items_tmp = this.getTestTmp();
      }
      this.dialog_arr = true;
    },
    tempOverwork() {},
    viewArrangement(item) {},
    editArrangement(item) {
      this.batchEnabled = false;
      this.arrData = this.getTestData();
      this.items_arr = this.parseData(this.arrData);
      if (this.items_tmp.length === 0) {
        this.items_tmp = this.getTestTmp();
      }
      this.editItem = item;
      this.dialog_arr = true;
    },
    saveArrangement() {
      console.log(this.arrData);
      // TODO: POST TO SERVER
      this.editItem = null;
      this.dialog_arr = false;
    },
    applyTemplate(item) {
      let data = {};
      data.uIds = this.batchEnabled
        ? this.selectedEmployees
        : [this.editItem.uId];
      data.arrangement = item.template;
      this.arrData = item.template;
      console.log(data);

      // TODO: POST TO SERVER
      this.dialog_arr = false;
    },
    async saveTemplate() {
      let temp = {
        name: this.tmpName,
        arrangement: this.arrData
      };
      console.log(temp);
      // try {
      //   let result = await this.$http.post("/schedule/template_save.do", {
      //     name: this.tmpName,
      //     arrangement: this.arrData
      //   });
      //   this.snackbarMsg = result.data.msg;
      //   this.snackbar = true;
      // } catch (err) {
      //   console.log(err);
      //   this.snackbarMsg = err.data ? err.data.msg : "保存模版失败：服务器错误";
      //   this.snackbar = true;
      // }
    },
    initShift() {
      this.time = [null, null, null, null, null, null, null];
      this.shiftNumber = this.arrData[this.shiftIndex].times;
      for (let i = 1; i <= this.shiftNumber; i++) {
        let regRes = /(\d{2}:\d{2})-(\d{2}:\d{2})/.exec(
          this.arrData[this.shiftIndex].durations[i - 1]
        );
        this.time[2 * i - 1] = regRes[1];
        this.time[2 * i] = regRes[2];
      }
    },
    editShift(item) {
      this.shiftIndex = this.items_arr.indexOf(item);
      this.initShift();
      this.dialog_shift = true;
    },
    cancelShift() {
      this.initShift();
      this.dialog_shift = false;
    },
    saveShift() {
      let temp = {};
      temp.times = this.shiftNumber;
      if (this.shiftNumber > 0) {
        temp.durations = [];
        for (let i = 1; i <= this.shiftNumber; i++) {
          temp.durations.push(this.time[2 * i - 1] + "-" + this.time[2 * i]);
        }
      }
      this.arrData[this.shiftIndex] = temp;
      this.items_arr = this.parseData(this.arrData);
      this.dialog_shift = false;
    }
  }
};
</script>

<style scoped></style>
