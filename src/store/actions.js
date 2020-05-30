import Vue from "vue";

export const setUser = ({ commit, store }, user) => {
  if (user) {
    commit("changeUserStatus", true);
    commit("changeUserId", user.id);
    commit("changeUserName", user.name);
    commit("changeUserRole", user.role);
    commit("changeUserToken", user.token);
    localStorage.setItem("token", user.token);
  } else {
    commit("changeUserStatus", false);
    commit("changeUserRole", 0);
    commit("changeUserId", null);
    commit("changeUserName", null);
    commit("changeUserToken", null);
    localStorage.removeItem("token");
  }
};

export const validateUser = async ({ dispatch }) => {
  if (localStorage.getItem("token")) {
    try {
      let result = await Vue.prototype.$http.get("/manager/authorization.do");
      let content = result.data.data;
      let user = {
        id: content.uid,
        name: content.uName,
        role: content.role,
        token: content.token
      };
      console.log(content);
      localStorage.setItem("token", user.token);
      await dispatch("setUser", user);
      return true;
    } catch (err) {
      console.log(err);
      localStorage.removeItem("token");
      await dispatch("setUser", null);
      return false;
    }
  } else return false;
};
