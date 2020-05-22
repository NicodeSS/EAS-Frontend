export const changeDrawerState = (state, DrawerState) => {
  state.drawer = DrawerState;
};

export const changeUserStatus = (state, status) => {
  state.userIsLogin = status;
};

export const changeUserType = (state, type) => {
  state.userType = type;
};

export const changeUserId = (state, id) => {
  state.userId = id;
};

export const changeUserName = (state, username) => {
  state.userName = username;
};
