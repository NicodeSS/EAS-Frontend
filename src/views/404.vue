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
                Oops.. We can't find this page.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "404"
};
</script>

<style scoped>
body {
  background: bisque;
}
</style>
