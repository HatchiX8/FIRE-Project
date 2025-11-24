export const getStockInfo = {
  url: '/api/v1/stockInfo',
  method: 'get',
  response: () => ({
    status: true,
    message: '成功取得持股配置',
    data: [
      { stockId: '2330', stockName: '台積電' },
      { stockId: '2317', stockName: '鴻海' },
    ],
  }),
};
