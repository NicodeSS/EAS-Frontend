<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" flat>
                <v-toolbar-title>叮咚员工管理系统 - 登陆</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-alert type="error" v-show="showErr">
                  {{ errorMsg }}
                </v-alert>
                <v-form v-model="valid">
                  <v-text-field
                    label="工号"
                    v-model="username"
                    :rules="nameRules"
                    prepend-icon="person"
                    type="text"
                    required
                  ></v-text-field>

                  <v-text-field
                    label="密码"
                    v-model="password"
                    :rules="passRules"
                    prepend-icon="lock"
                    type="password"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  @click="doLogin($event)"
                  >登陆</v-btn
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
  name: "Login",
  data: () => ({
    valid: false,
    username: "",
    password: "",
    errorMsg: "",
    showErr: false,
    nameRules: [
      v => !!v || "请输入用户名",
      v => (v.length >= 4 && v.length <= 20) || "用户名长度为4-20个字符"
    ],
    passRules: [
      v => !!v || "请输入密码",
      v => (v.length >= 4 && v.length <= 20) || "密码长度为4-20个字符"
    ]
  }),
  methods: {
    async doLogin(event) {
      event.preventDefault();
      this.showErr = false;
      try {
        let result = await this.$http.post("/manager/login.do", {
          uId: this.username,
          password: this.password
        });
        let content = result.data.data;
        let user = {
          id: content.uid,
          name: content.uName,
          role: content.role,
          token: content.token
        };
        this.$store.dispatch("setUser", user);

        if (this.$route.query.redirect) {
          let redirect = this.$route.query.redirect;
          this.$router.push(redirect);
        } else {
          this.$router.push("/");
        }
      } catch (err) {
        console.error(err);
        this.errorMsg = err.data ? err.data.msg : "服务器错误";
        this.showErr = true;
      }
    }
  }
};
</script>
