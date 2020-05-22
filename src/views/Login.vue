<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>员工管理系统 - 登陆</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
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
                  >Login</v-btn
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
    nameRules: [
      v => !!v || "请输入用户名",
      v => (v.length >= 6 && v.length <= 16) || "用户名长度为6-16个字符"
    ],
    passRules: [
      v => !!v || "请输入密码",
      v => (v.length >= 6 && v.length <= 16) || "密码长度为6-16个字符"
    ]
  }),
  methods: {
    doLogin(event) {
      event.preventDefault();
      alert("Hi");
      this.$store.dispatch("setUser", { type: 1, id: 1, name: "Nicode" });
    }
  }
};
</script>
