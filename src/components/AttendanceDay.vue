<template>
  <v-row align="center" justify="center">
    <v-col cols="5" align="center" justify="center">
      <div class="d-flex flex-column">
        <v-progress-circular
          :rotate="-90"
          :size="320"
          :width="15"
          :value="percentage"
          color="primary"
        >
          <div class="presence">{{ presence }}</div>
          <div class="slash">/</div>
          <div class="total">{{ total }}</div>
        </v-progress-circular>

        <v-card class="d-flex my-6" width="400px">
          <v-spacer></v-spacer>
          <div class="info-text">
            <span class="info-presence">已到</span>
            <span>{{ presence }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-divider vertical></v-divider>
          <v-spacer></v-spacer>
          <div class="info-text">
            <span class="info-absenteeism">缺勤</span>
            <span>{{ absenteeism }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-divider vertical></v-divider>
          <v-spacer></v-spacer>
          <div class="info-text">
            <span class="info-leave">请假</span>
            <span>{{ leave }}</span>
          </div>
          <v-spacer></v-spacer>
        </v-card>
      </div>
    </v-col>
    <v-col cols="7">
      <span>离岗人员名单</span>
      <v-data-table
        height="480px"
        :headers="headers"
        :items="items"
        item-key="uId"
        :loading="loading"
        loading-text="Loading... Please wait."
        :no-data-text="errMsg"
        :options.sync="options"
        :server-items-length="totalCount"
      >
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "AttendanceDay",
  data() {
    return {
      presence: 200,
      absenteeism: 200,
      leave: 200,
      total: 600,

      loading: false,
      options: {
        page: 1,
        itemsPerPage: 15
      },
      headers: [
        { value: "uId", text: "工号", align: "start" },
        { value: "name", text: "姓名" },
        { value: "departmentName", text: "部门" },
        { value: "role", text: "职位" },
        { value: "status", text: "离岗原因" }
      ],
      totalCount: 0,
      items: [],
      errMsg: "无数据"
    };
  },
  computed: {
    percentage() {
      return this.total ? Math.floor((this.presence / this.total) * 100) : 100;
    }
  },
  watch: {
    options: {
      handler() {
        this.getOverview();
      }
    }
  },
  mounted() {
    this.getOverview();
  },
  methods: {
    async getOverview() {
      this.loading = true;
      try {
        let result = await this.$http.get("/manager/now_attendance_list.do", {
          page: this.options.page,
          limit: this.options.itemsPerPage
        });
        console.log(result.data);
        let resData = result.data.data;
        this.totalCount = resData.count;
        this.items = resData.items;
        this.total = resData.total;
        this.presence = resData.presence;
        this.absenteeism = resData.absenteeism;
        this.leave = resData.leave;
      } catch (err) {
        this.items = [];
        this.errMsg = err.data ? err.data.msg : "与服务器连接出错";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.presence,
.total {
  position: relative;
  font-size: 70px;
  --text-padding-x: 0px;
  --text-padding-y: 45px;
}
.presence {
  padding: 0 var(--text-padding-x) var(--text-padding-y) 0;
}
.total {
  padding: var(--text-padding-y) 0 0 var(--text-padding-x);
}
.slash {
  font-size: 80px;
}

.info-text {
  font-size: 28px;
}
.info-text > .info-presence {
  color: deepskyblue;
}
.info-text > .info-absenteeism {
  color: red;
}
.info-text > .info-leave {
  color: yellow;
}
</style>
