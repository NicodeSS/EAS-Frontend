export const changeDrawerState = (state, DrawerState) => {
  state.drawer = DrawerState;
};

export const changeLoginStatus = (state, status) => {
  state.isLogin = status;
};

export const changeIdentity = (state, identity) => {
  state.identity = identity;
};

