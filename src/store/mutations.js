export const changeDrawerState = (state, DrawerState) => {
  state.drawer = DrawerState;
};

export const changeUserStatus = (state, status) => {
  state.userIsLogin = status;
};

export const changeUserId = (state, id) => {
  state.userId = id;
};

export const changeUserRole = (state, type) => {
  state.userRole = type;
};

export const changeUserName = (state, username) => {
  state.userName = username;
};

export const changeUserToken = (state, token) => {
  state.userToken = token;
};
