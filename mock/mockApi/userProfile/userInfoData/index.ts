export const userInfoData = {
  url: '/api/v1/users/info',
  method: 'get',
  response: () => ({
    status: true,
    message: '成功取得使用者資料',
    data: {
      name: '陳大大',
      nickname: '沒事多喝水',
      email: 'ogsmj116@gmail.com',
      role: 'user',
      // role: 'admin',
      avatar_url: null,
      upgrade_status: 'trial',
    },
  }),
};

export const userUpdate = {
  url: '/api/v1/users/update',
  method: 'patch',
  response: () => ({
    status: true,
    message: '成功更新使用者資料',
  }),
};

export const userAccountUpgrade = {
  url: '/api/v1/users/account-upgrade',
  method: 'patch',
  response: () => ({
    status: true,
    message: '成功送出帳號升級申請',
  }),
};
