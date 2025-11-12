export const getHoldings = {
  url: '/api/v1/users/portfolio/holdings',
  method: 'get',
  response: () => ({
    status: true,
    message: '成功取得使用者資料',
    data: {
      shareholding: [
        {
          assetId: 'UUID',
          stockId: '2344',
          stockName: '華邦電',
          quantity: 100,
          buyPrice: 581.62,
          currentPrice: 600,
          marketValue: 60000,
          totalCost: 58162,
          profitRate: 3.16,
          note: '跌破月線停損停利',
          created_at: '2025/08/11',
          updated_at: '2025/08/11',
        },
        {
          assetId: 'UUID12',
          stockId: '2330',
          stockName: '台積電',
          quantity: 100,
          buyPrice: 581.62,
          currentPrice: 600,
          marketValue: 60000,
          totalCost: 58162,
          profitRate: 3.16,
          note: '跌破月線停損停利',
          created_at: '2025/08/11',
          updated_at: '2025/08/11',
        },
      ],
      pagination: {
        total_page: 3,
        current_page: 1,
      },
    },
  }),
};
