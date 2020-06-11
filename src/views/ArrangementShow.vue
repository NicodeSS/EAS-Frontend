<template>
  <v-card height="600">
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
    <v-dialog v-model="moreOpen" max-width="800px">
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar color="cyan" dark>
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
        this.getArrangement();
      }
    }
  },
  methods: {
    async getArrangement() {
      try {
        let result = await this.$http.get("/schedule/view_month.do", {
          departmentId: this.departmentId,
          day: this.focus
        });
        this.name = result.data.data.name;
        this.events = result.data.data.events;
      } catch (err) {
        console.log(err);
        this.events = [];
      }
    },
    async getDepartments() {
      if (this.departments.length <= 1) {
        try {
          let result = await this.$http.get("/manager/department_list.do");
          this.departments = result.data.data.items;
          this.departments.push({ id: -1, name: "请选择" });
        } catch (err) {
          console.log(err);
          this.departments = [{ id: -1, name: "请选择" }];
          this.departmentId = -1;
        }
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
        if (event.start === date) events.push(event);
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
    edit(uId) {
      this.$router.push("/arrangement_manage/employee/" + uId);
    }
  }
};
</script>

<style scoped></style>
