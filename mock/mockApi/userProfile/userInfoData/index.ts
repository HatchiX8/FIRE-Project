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
      role: 'guest',
      avatar_url: null,
      upgrade_status: 'trial',
    },
  }),
};
