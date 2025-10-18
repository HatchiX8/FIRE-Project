export const getSummary = {
  url: '/api/v1/users/:userId/portfolio/summary',
  method: 'get',
  response: () => ({
    status: true,
    message: '成功取得使用者資料',
    data: {
      totalInvest: 170000,
      cashInvest: 65000,
      stockValue: 110000,
      stockCost: 105000,
      positionRatio: 0.617,
      stockProfit: 5000,
      profitRate: 4.76,
    },
  }),
};
