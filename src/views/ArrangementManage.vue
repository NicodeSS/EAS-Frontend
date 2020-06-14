<template>
  <v-responsive>
    <!-- 消息条 -->
    <v-snackbar v-model="snackbar">
      {{ snackbarMsg }}
      <v-btn color="primary" text @click="snackbar = false">
        关闭
      </v-btn>
    </v-snackbar>

    <!-- 排班表格 -->
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
      <!-- 顶部工具条 -->
      <template v-slot:top>
        <v-toolbar flat>
          <!-- 批量排班 -->
          <v-btn class="mx-1" color="primary" @click="batchArrange"
            >批量排班</v-btn
          >

          <!-- 临时加班对话框 -->
          <v-dialog
            v-if="isBoss"
            v-model="dialog_overwork"
            persistent
            max-width="500px"
          >
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1" color="secondary" v-on="on">临时加班</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">临时全体加班</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-menu
                      ref="menu"
                      v-model="menu_over[0]"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="time_over[0]"
                          label="开始日期"
                          prepend-icon="access_time"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="time_over[0]"
                        :max="time_over[2]"
                        no-title
                        scrollable
                        locale="zh-cn"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="6">
                    <v-menu
                      ref="menu"
                      v-model="menu_over[1]"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="time_over[1]"
                          label="开始时间"
                          prepend-icon="access_time"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu_over[1]"
                        v-model="time_over[1]"
                        :max="time_end"
                        format="24hr"
                        full-width
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-menu
                      ref="menu"
                      v-model="menu_over[2]"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="time_over[2]"
                          label="结束日期"
                          prepend-icon="access_time"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="time_over[2]"
                        :min="time_over[0]"
                        no-title
                        scrollable
                        locale="zh-cn"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="6">
                    <v-menu
                      ref="menu"
                      v-model="menu_over[3]"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="time_over[3]"
                          label="结束时间"
                          prepend-icon="access_time"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu_over[3]"
                        v-model="time_over[3]"
                        :min="time_begin"
                        format="24hr"
                        full-width
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancelOverwork"
                  >取消</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="overwork_valid"
                  @click="tempOverwork"
                  >确定</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- 排班对话框 -->
          <v-dialog v-model="dialog_arr" persistent max-width="1000px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ dialog_arr_title }}</span>
              </v-card-title>

              <!-- 批量排班员工选择框 -->
              <v-card-text>
                <v-select
                  v-if="batch_edit"
                  v-model="selectedEmployees"
                  :items="employees"
                  item-text="name"
                  item-value="uId"
                  chips
                  label="需排班的员工"
                  multiple
                  hide-details
                  outlined
                  dense
                ></v-select>
              </v-card-text>

              <!-- 选项卡 -->
              <v-tabs v-model="tab" color="primary">
                <v-tab :href="'#tab-1'">直接编辑</v-tab>
                <v-tab :href="'#tab-2'">模版导入</v-tab>
                <v-tab :href="'#tab-3'">临时排班</v-tab>

                <!-- 直接编辑 -->
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
                        <v-col cols="1">
                          <v-btn @click="copyArrangement">复制</v-btn>
                        </v-col>
                        <v-col cols="1">
                          <v-btn :disabled="!pasted" @click="pasteArrangement"
                            >粘贴</v-btn
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
                <!-- 模版导入 -->
                <v-tab-item :value="'tab-2'">
                  <v-card-text>
                    <v-container>
                      <v-data-table
                        :headers="headers_tmp"
                        :items="items_tmp"
                        :loading="loading_tmp"
                        item-key="id"
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
                <!-- 临时排班 -->
                <v-tab-item :value="'tab-3'">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <v-menu
                            ref="menu"
                            v-model="menu_temp"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="date_temp"
                                label="调整日期"
                                prepend-icon="access_time"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date_temp"
                              :min="today"
                              no-title
                              scrollable
                              locale="zh-cn"
                            >
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="6">
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
                        </v-col>
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
                    <v-btn color="blue darken-1" text @click="cancelTempEdit"
                      >取消</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="saveTempEdit"
                      >保存</v-btn
                    >
                  </v-card-actions>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-dialog>

          <v-divider v-if="isDM" class="mx-4" inset vertical></v-divider>

          <!-- 打卡位置设置对话框 -->
          <v-dialog
            v-if="isDM"
            v-model="dialog_location_edit"
            persistent
            max-width="500px"
          >
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1" color="secondary" v-on="on"
                >修改打卡地点</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">修改打卡地点</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="location[0]"
                      label="经度"
                      single-line
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="location[1]"
                      label="纬度"
                      single-line
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancelLocation"
                  >取消</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="!(location[0] && location[1])"
                  @click="saveLocation"
                  >确定</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-divider class="mx-4" inset vertical></v-divider>
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
      dialog_overwork: false,
      dialog_location_edit: false,

      snackbar: false,
      snackbarMsg: "",

      batch_edit: false,
      direct_edit: false,

      tmpName: "",
      employees: [],
      selectedEmployees: [],
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
      options: {
        page: 1,
        itemsPerPage: 15
      },
      keyword: "",
      headers: [
        {
          text: "工号",
          align: "start",
          value: "uId"
        },
        { text: "姓名", value: "name" },
        { text: "部门", value: "departmentName" },
        { text: "职位", value: "roleName" },
        { text: "当前排班", value: "preview" },
        { text: "操作", value: "actions" }
      ],
      totalCount: 0,
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
      errMsg_arr: "无排班数据",

      loading_tmp: false,
      options_tmp: {
        page: 1,
        itemsPerPage: 15
      },
      headers_tmp: [
        {
          text: "模版名",
          align: "start",
          value: "name"
        },
        { text: "操作", value: "actions" }
      ],
      totalCount_tmp: 0,
      items_tmp: [],
      errMsg_tmp: "数据库中无排班模版",

      arrData: [],
      editIndex: -1,
      editItem: null,
      shiftIndex: -1,
      shiftNumber: 0,

      time: [null, null, null, null, null, null, null, null],
      menu: [false, false, false, false, false, false, false],
      date_temp: "",
      menu_temp: false,
      time_over: [null, null, null, null],
      menu_over: [false, false, false, false],

      location: [null, null]
    };
  },
  computed: {
    // 判断要保存的模版名是否有效
    valid() {
      return this.tmpName.length;
    },
    // 剪贴板里是否存在排班
    pasted() {
      return localStorage.getItem("pastedArrangement");
    },
    // 排班是否有效
    shiftAvailable() {
      if (!this.shiftNumber) return true;
      for (let i = 1; i <= 2 * this.shiftNumber; i++)
        if (!this.time[i]) return false;
      return true;
    },
    // 当前用户是否为主管
    isDM() {
      return this.$store.getters.userRole === 1;
    },
    // 当前用户是否为经理
    isBoss() {
      return this.$store.getters.userRole === 2;
    },
    // 排班对话框标题
    dialog_arr_title() {
      return this.batch_edit ? "批量排班" : "排班";
    },
    // 有效开始时间
    time_begin() {
      if (
        this.time_over[0] < this.time_over[2] ||
        !this.time_over[0] ||
        !this.time_over[2]
      )
        return "00:00";
      else if (this.time_over[0] === this.time_over[2])
        return this.time_over[1];
      else return "23:59";
    },
    // 有效结束时间
    time_end() {
      if (
        this.time_over[0] < this.time_over[2] ||
        !this.time_over[0] ||
        !this.time_over[2]
      )
        return "23:59";
      else if (this.time_over[0] === this.time_over[2])
        return this.time_over[3];
      else return "00:00";
    },
    // 创建的加班是否有效
    overwork_valid() {
      return !(
        this.time_over[0] < this.time_over[2] ||
        (this.time_over[0] === this.time_over[2] &&
          this.time_over[1] < this.time_over[3])
      );
    },
    // 今日日期
    today() {
      return new Date().toISOString().substr(0, 10);
    }
  },
  watch: {
    items: {
      handler() {
        for (let i in this.items) {
          this.items[i].preview = this.generatePreview(
            this.items[i].arrangements
          );
        }
      }
    },
    arrData: {
      handler() {
        this.items_arr = this.parseData(this.arrData);
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
    },
    options_tmp: {
      handler() {
        this.getTemplateList();
      }
    },
    deep: true
  },
  mounted() {
    if (this.$route.params.uId) {
      this.directEditArrangement(this.$route.params.uId);
    }
    this.date_temp = this.today;

    this.getOverview();
  },
  methods: {
    // 获取员工排班总览
    async getOverview() {
      this.loading = true;
      try {
        let result = await this.$http.get("/schedule/arrangement_list.do", {
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
    // 获取员工列表（批量排班用）
    async getEmployeeList() {
      try {
        let result = await this.$http.get("/manager/employee_full_list.do");
        this.employees = result.data.data.items;
      } catch (err) {
        this.employees = [];
        alert("无法获取员工列表!");
      }
    },
    // 获取排班模版列表
    async getTemplateList() {
      this.loading_tmp = true;
      try {
        let result = await this.$http.get("/template/template_list.do", {
          page: this.options_tmp.page,
          limit: this.options_tmp.itemsPerPage
        });
        this.totalCount_tmp = result.data.data.count;
        this.items_tmp = result.data.data.templates;
      } catch (err) {
        this.totalCount_tmp = 0;
        this.items_tmp = [];
        this.errMsg_tmp = err.data ? err.data.msg : "与服务器连接出错";
      } finally {
        this.loading_tmp = false;
      }
    },
    // 保存排班模版
    async saveTemplate() {
      let temp = {
        name: this.tmpName,
        arrangement: this.arrData
      };
      try {
        let result = await this.$http.post("/template/template_add.do", temp);
        this.snackbarMsg = result.data.msg;
        this.snackbar = true;
        await this.getTemplateList();
      } catch (err) {
        console.error(err);
        this.snackbarMsg = err.data ? err.data.msg : "保存模版失败：服务器错误";
        this.snackbar = true;
      }
    },
    // 解析排班格式
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
    // 生成当前排班预览
    generatePreview(arrangement) {
      let options = ["休", "一", "二", "三"];
      let str = "";
      for (let i in arrangement) {
        str += options[arrangement[i].times];
      }
      return str;
    },
    // 打开批量排班对话框处理
    batchArrange() {
      this.batch_edit = true;
      this.getEmployeeList();
      this.getTemplateList();
      this.editIndex = -1;
      this.editItem = [];
      this.arrData = this.defaultArrangement;
      this.items_arr = this.parseData(this.arrData);
      this.dialog_arr = true;
    },
    // 加班对话框 - 取消
    cancelOverwork() {
      this.time_over = [null, null, null, null];
      this.dialog_overwork = false;
    },
    // 加班对话框 - 创建
    async tempOverwork() {
      let begin = this.time_over[0] + " " + this.time_over[1];
      let end = this.time_over[2] + " " + this.time_over[3];
      try {
        let result = await this.$http.post("/schedule/overwork_create.do", {
          begin: begin,
          end: end
        });
        this.snackbarMsg = result.data.msg;
        this.snackbar = true;
        this.dialog_overwork = false;
      } catch (err) {
        console.error(err);
        this.snackbarMsg = err.data ? err.data.msg : "创建加班失败：服务器错误";
        this.snackbar = true;
      }
    },
    // 查看员工排班
    viewArrangement(item) {
      this.$router.push("/arrangement_show/employee/" + item.uId);
    },
    // 从其他页面直接修改排班
    async directEditArrangement(uId) {
      this.direct_edit = true;
      this.batch_edit = false;
      let temp = {};
      await this.getTemplateList();
      try {
        let result = await this.$http.get("/schedule/employee_arrangement.do", {
          uId: uId
        });
        temp.arrangements = result.data.data.arrangement;
      } catch (err) {
        console.error(err);
      }
      this.arrData = temp.arrangements;
      this.items_arr = this.parseData(this.arrData);
      this.dialog_arr = true;
    },
    // 排班对话框 - 打开
    async editArrangement(item) {
      this.batch_edit = false;
      await this.getTemplateList();
      this.editIndex = this.items.indexOf(item);
      this.editItem = item;
      try {
        let result = await this.$http.get("/schedule/employee_arrangement.do", {
          uId: item.uId
        });
        this.editItem.arrangements = result.data.data.arrangement;
      } catch (err) {
        console.error(err);
      }
      this.arrData = item.arrangements;
      this.items_arr = this.parseData(this.arrData);
      this.dialog_arr = true;
    },
    // 排班对话框 - 保存
    async saveArrangement() {
      let uids = this.batch_edit ? this.selectedEmployees : [this.editItem.uId];
      try {
        let result = await this.$http.post("/schedule/arrangement_edit.do", {
          uIds: uids,
          arrangement: this.arrData
        });
        if (!this.batch_edit && !this.direct_edit) {
          this.items[this.editIndex].arrangements = this.arrData;
          this.items[this.editIndex].preview = this.generatePreview(
            this.arrData
          );
        } else await this.getOverview();
        this.snackbarMsg = result.data.msg;
        this.snackbar = true;

        this.editIndex = -1;
        this.editItem = null;
        this.arrData = [];
        this.dialog_arr = false;
      } catch (err) {
        console.error(err);
        this.snackbarMsg = err.data ? err.data.msg : "保存失败：服务器错误";
        this.snackbar = true;
      } finally {
        this.direct_edit = false;
      }
    },
    // 排班对话框 - 应用模版
    applyTemplate(item) {
      this.arrData = item.arrangement;
      this.saveArrangement();
    },
    // 班次对话框 - 初始化
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
    // 班次对话框 - 编辑
    editShift(item) {
      this.shiftIndex = this.items_arr.indexOf(item);
      this.initShift();
      this.dialog_shift = true;
    },
    // 班次对话框 - 取消
    cancelShift() {
      this.initShift();
      this.dialog_shift = false;
    },
    // 班次对话框 - 保存
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
    },
    // 排班对话框 - 复制排班
    copyArrangement() {
      let arrangement = JSON.stringify(this.arrData);
      localStorage.setItem("pastedArrangement", arrangement);
    },
    // 排班对话框 - 粘贴排班
    pasteArrangement() {
      let arrangement = localStorage.getItem("pastedArrangement");
      this.arrData = JSON.parse(arrangement);
      this.editItem.arrangements = arrangement;
      this.items_arr = this.parseData(this.arrData);
    },
    // 排班对话框 - 临时加班 - 取消
    cancelTempEdit() {
      this.time = [null, null, null, null, null, null, null];
      this.shiftNumber = 0;
      this.date_temp = this.today;
      this.dialog_arr = false;
    },
    // 排班对话框 - 临时加班 - 保存
    async saveTempEdit() {
      let temp = {};
      temp.uIds = this.batch_edit
        ? this.selectedEmployees
        : [this.editItem.uId];
      temp.start = this.date_temp;
      temp.times = this.shiftNumber;
      if (this.shiftNumber > 0) {
        temp.durations = [];
        for (let i = 1; i <= this.shiftNumber; i++) {
          temp.durations.push(this.time[2 * i - 1] + "-" + this.time[2 * i]);
        }
      }
      try {
        let result = await this.$http.post(
          "/schedule/employee_arrangement_temp.do",
          temp
        );
        this.snackbarMsg = result.data.msg;
        this.editIndex = -1;
        this.editItem = null;
        this.arrData = [];
      } catch (err) {
        console.error(err);
        this.snackbarMsg = err.data ? err.data.msg : "保存失败：服务器错误";
      } finally {
        this.cancelTempEdit();
        this.snackbar = true;
      }
    },
    // 打卡地点修改对话框 - 取消
    cancelLocation() {
      this.location = [null, null];
      this.dialog_location_edit = false;
    },
    // 打卡地点修改对话框 - 保存
    async saveLocation() {
      try {
        let result = await this.$http.post("/schedule/location_edit.do", {
          location: this.location
        });
        this.snackbarMsg = result.data.msg;
        thgis.dialog_location_edit = false;
      } catch (err) {
        console.error(err);
        this.snackbarMsg = err.data ? err.data.msg : "保存失败：服务器错误";
      } finally {
        this.snackbar = true;
      }
    }
  }
};
</script>

<style scoped></style>
