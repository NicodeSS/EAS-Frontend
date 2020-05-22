export const setUser = ({ commit, store }, user) => {
  if (user) {
    commit("changeLoginStatus", true);
    commit("changeIdentity", 1);
  } else {
    commit("changeLoginStatus", false);
    commit("changeIdentity", 0);
  }
};
