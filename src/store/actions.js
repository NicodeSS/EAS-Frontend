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
