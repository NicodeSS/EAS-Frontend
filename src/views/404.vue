<template>
  <v-app>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-1">
              <v-card-title>
                404 Not Found...
              </v-card-title>
              <v-card-text>
                这个页面不见了……可能是飞往火星了^_^
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="back()"
                  >返回上一页</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
body {
  background: bisque;
}
</style>
