<template>
  <v-tooltip bottom color="orange" v-if="hasApplication">
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
    // 获取是否有未审批项
    async getInfo() {
      try {
        let result = await this.$http.get("/event/event_list.do", {
          page: 1,
          limit: 15,
          keyword: ""
        });
        this.hasApplication = result.data.data.count > 0;
        if (!this.hasApplication) this.canSendNoti = true;
      } catch (err) {
        console.error("获取审批动态出错");
        console.error(err);
      }
    },
    // 刷新及发送通知
    doLogic() {
      this.getInfo();
      if (this.hasApplication && this.canSendNoti) {
        this.sendNotification();
        this.canSendNoti = false;
      }
    },
    // 设置刷新定时器和通知发送定时器
    setTimer() {
      let _this = this;
      this.timer = setInterval(() => {
        _this.doLogic();
      }, 7000);
      this.timer_noti = setInterval(() => {
        _this.canSendNoti = true;
      }, 3600000);
    },
    // 删除定时器
    clearTimer() {
      this.timer = null;
      this.timer_noti = null;
    },
    // 跳转审批页面
    jumpApproval() {
      this.$router.push("/approval_manage");
    },
    // 发送通知
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
