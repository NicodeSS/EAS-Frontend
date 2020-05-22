export const setUser = ({ commit, store }, user) => {
  if (user) {
    commit("changeUserStatus", true);
    commit("changeUserType", user.type);
    commit("changeUserId", user.id);
    commit("changeUserName", user.name);
  } else {
    commit("changeUserStatus", false);
    commit("changeUserType", 0);
    commit("changeUserId", null);
    commit("changeUserName", null);
  }
};
