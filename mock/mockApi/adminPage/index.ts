export const userUpgradeList = {
  url: '/api/v1/admin/upgrade-requests',
  method: 'get',
  response: () => ({
    message: '成功取得申請者資料',
    data: [
      {
        id: 'uuid-1234',
        name: '陳大大',
        upgradeReason: '我想要申請成為正式會員',
        createdAt: '2025/07/28 10:32',
      },
      {
        id: 'uuid-2345',
        name: '張大大',
        upgradeReason: '你好，我想申請成為會員',
        createdAt: '2025/07/28 10:42',
      },
    ],
  }),
};

export const userMemberList = {
  url: '/api/v1/admin/member',
  method: 'get',
  response: () => ({
    message: '成功取得使用者資料',
    data: [
      {
        id: 'uuid-9453',
        name: '吳大大',
        memberAge: 364,
        userNote: '正常會員',
      },
      {
        id: 'uui-5379',
        name: '王大大',
        memberAge: 256,
        userNote: '正常會員',
      },
    ],
  }),
};

export const userUpgradeReview = {
  url: '/api/v1/admin/upgrade-requests/:userId/review',
  method: 'patch',
  response: () => ({
    message: '使用者審核通過',
  }),
};

// export const userUpgradeReview = {
//   url: '/api/v1/admin/users/:userId/activation',
//   method: 'patch',
//   response: () => ({
//     message: '帳號已禁用',
//   }),
// };
