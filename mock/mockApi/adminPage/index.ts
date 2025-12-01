export const userUpgradeList = {
  url: '/api/v1/admin/upgrade-requests',
  method: 'get',
  response: () => ({
    status: true,
    message: '成功取得使用者資料',
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
