<template>
  <v-tooltip bottom color="orange">
    <template v-slot:activator="{ on }">
      <v-btn icon color="orange" dark v-on="on" @click="jumpApproval"
        ><v-icon>mdi-alert-circle</v-icon></v-btn
      >
    </template>
    您有未处理的审批！
  </v-tooltip>
</template>

<script>
export default {
  name: "ApplicationAlert",
  data() {
    return {
      hasApplication: false,
      canSendNoti: true,
      timer: null,
      timer_noti: null
    };
  },
  created() {
    this.setTimer();
  },
  destroyed() {
    this.clearTimer();
  },
  methods: {
    async getInfo() {
      try {
        let result = await this.$http.get("/event/event_list.do", {
          page: 1,
          limit: 15,
          keyword: ""
        });
        this.hasApplication = result.data.data.count > 0;
      } catch (err) {
        console.err("获取审批动态出错");
        console.err(err);
      }
      this.hasApplication = true;
    },
    doLogic() {
      this.getInfo();
      if (this.hasApplication && this.canSendNoti) {
        console.log("Can send!");
        this.sendNotification();
        this.canSendNoti = false;
      }
    },
    setTimer() {
      let _this = this;
      this.timer = setInterval(() => {
        _this.doLogic();
      }, 7000);
      this.timer_noti = setInterval(() => {
        _this.canSendNoti = true;
      }, 3600000);
    },
    clearTimer() {
      this.timer = null;
      this.timer_noti = null;
    },
    jumpApproval() {
      this.$router.push("/approval_manage");
    },
    sendNotification() {
      if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
          let noti = new Notification("审批提醒", {
            body: "您有未处理的审批！"
          });
        });
      }
    }
  }
};
</script>

<style scoped></style>
