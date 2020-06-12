<template>
  <v-card height="600">
    <!-- 顶部工具条 -->
    <v-card-text class="text--accent-1">
      <v-row class="justify-center align-center">
        <v-col cols="3">
          <v-select
            v-if="isBoss"
            v-model="departmentId"
            :items="departments"
            item-text="name"
            item-value="id"
            label="部门"
            required
          ></v-select>
        </v-col>
        <span class="mx-4">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn class="mx-1" fab text small color="grey darken-2" @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn class="mx-1" fab text small color="grey darken-2" @click="next">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn outlined class="mx-2" color="grey darken-2" @click="setToday">
          今日
        </v-btn>
      </v-row>
    </v-card-text>

    <!-- 日历主体 -->
    <v-calendar
      ref="calendar"
      type="month"
      :events="events"
      v-model="focus"
      :now="today"
      :event-color="getEventColor"
      color="primary"
      @click:event="showEvent"
      @click:more="showList"
      @change="updateEvent"
    ></v-calendar>

    <!-- 活动详情菜单 -->
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
    >
      <v-card min-width="350px" flat>
        <v-toolbar :color="selectedEvent.color">
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="edit(selectedEvent.uId)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <span v-for="(item, i) in selectedEvent.shifts" :key="i"
            >第{{ i + 1 }}班:
            <strong>{{ selectedEvent.start }} {{ item }}<br /></strong
          ></span>
        </v-card-text>
      </v-card>
    </v-menu>

    <!-- 更多活动对话框 -->
    <v-dialog v-model="moreOpen" max-width="800px">
      <v-card min-width="350px" flat>
        <v-toolbar color="cyan">
          <v-toolbar-title>{{ moreDate }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="moreOpen = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-list two-line>
            <v-list-item v-for="(item, i) in moreEvents" :key="i">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle>
                  <span v-for="(shift, j) in item.shifts" :key="j">
                    {{ shift }}</span
                  >
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="edit(item.uId)">
                  <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "ArrangementShow",
  data() {
    return {
      name: "",
      focus: null,
      today: null,
      events: [],
      departments: [{ id: -1, name: "请选择" }],
      departmentId: -1,

      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,

      moreEvents: [],
      moreDate: null,
      moreOpen: false
    };
  },
  created() {
    this.today = new Date().toISOString().substr(0, 10);
    this.focus = this.today;
    if (this.isBoss) this.getDepartments();
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  computed: {
    isBoss() {
      return this.$store.getters.userRole === 2;
    },
    title() {
      if (this.departmentId === -1)
        if (this.isBoss) return "公司员工排班";
        else return "本部门员工排班";
      else {
        for (let department of this.departments)
          if (this.departmentId === department.id)
            return department.name + "员工排班";
      }
    }
  },
  watch: {
    departmentId: {
      handler() {
        this.getEvents();
      }
    }
  },
  methods: {
    // 获取活动列表
    async getEvents() {
      try {
        let result = await this.$http.get("/schedule/view_month.do", {
          departmentId: this.departmentId,
          day: this.focus
        });
        this.name = result.data.data.name;
        this.events = result.data.data.events;
      } catch (err) {
        console.error(err);
        this.events = [];
      }
    },
    // 获取部门列表（经理用）
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
    },
    // 获取当前活动颜色
    getEventColor(event) {
      return event.color;
    },
    // 显示活动菜单
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    // 更新活动
    updateEvent() {
      this.getEvents();
    },
    // 显示更多活动对话框
    showList(dateEvent) {
      let date = dateEvent.date;
      const open = () => {
        this.getEventsByDate(date);
        this.moreDate = date;
        setTimeout(() => (this.moreOpen = true), 10);
      };
      if (this.moreOpen) {
        this.moreOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
    },
    // 按日期获取当天所有活动
    getEventsByDate(date) {
      let events = [];
      for (let event of this.events) {
        if (event.start === date) events.push(event);
      }
      this.moreEvents = events;
    },
    // 上一月
    prev() {
      this.$refs.calendar.prev();
    },
    // 下一月
    next() {
      this.$refs.calendar.next();
    },
    // 跳转至今日视图
    setToday() {
      this.focus = this.today;
    },
    // 编辑员工排班
    edit(uId) {
      this.$router.push("/arrangement_manage/employee/" + uId);
    }
  }
};
</script>

<style scoped></style>
