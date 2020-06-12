<template>
  <v-card height="600">
    <v-card-text class="text--accent-1">
      <v-row class="justify-center align-center">
        <v-btn text class="text--darken-1" @click="$router.go(-1)"
          >< 返回</v-btn
        >
        <span class="mx-4">{{ name }} 的月排班</span>
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
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
    >
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar :color="selectedEvent.color" dark>
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon @click="edit">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <span
            >开始: <strong>{{ selectedEvent.start }}</strong></span
          >
          <v-divider></v-divider>
          <span v-if="selectedEvent.end"
            >结束: <strong>{{ selectedEvent.end }}</strong></span
          >
        </v-card-text>
      </v-card>
    </v-menu>
    <v-dialog v-model="moreOpen">
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>{{ moreDate }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="mx-1" icon @click="edit">
            <v-icon color="white">mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="mx-1" icon @click="moreOpen = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-list two-line>
            <v-list-item v-for="(item, i) in moreEvents" :key="i">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle
                  >{{ item.start }} - {{ item.end }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "EmployeeArrangement",
  data() {
    return {
      name: "",
      uId: null,
      focus: null,
      today: null,
      events: [],

      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,

      moreEvents: [],
      moreDate: null,
      moreOpen: false
    };
  },
  created() {
    this.uId = this.$route.params.uId ? this.$route.params.uId : null;
    this.today = new Date().toISOString().substr(0, 10);
    this.focus = this.today;
  },
  mounted() {
    if (!this.uId) {
      alert("员工不存在！");
      this.$route.go(-1);
    }
    this.$refs.calendar.checkChange();
  },
  methods: {
    async getArrangement() {
      try {
        let result = await this.$http.get("/schedule/view_month_employee.do", {
          uId: this.uId,
          day: this.focus
        });
        this.name = result.data.data.name;
        this.events = result.data.data.events;
      } catch (err) {
        console.error(err);
        let errMsg = err.data ? err.data.msg : "服务器错误，请稍后再试";
        alert(errMsg);
        this.$router.go(-1);
        this.events = [];
      }
    },
    getEventColor(event) {
      return event.color;
    },
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
    updateEvent() {
      this.getArrangement();
    },
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
    getEventsByDate(date) {
      let events = [];
      for (let event of this.events) {
        if (
          event.start.substr(0, 10) <= date &&
          date <= event.end.substr(0, 10)
        )
          events.push(event);
      }
      this.moreEvents = events;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    setToday() {
      this.focus = this.today;
    },
    edit() {
      this.$router.push("/arrangement_manage/employee/" + this.uId);
    }
  }
};
</script>

<style scoped></style>
