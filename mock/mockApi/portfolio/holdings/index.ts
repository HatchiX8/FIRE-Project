export const getHoldings = {
  url: '/api/v1/users/portfolio/holdings',
  method: 'get',
  response: () => ({
    status: true,
    message: '成功取得持股配置',
    data: {
      shareholding: [
        {
          assetId: 'UUID',
          stockId: '2344',
          stockName: '華邦電',
          quantity: 100,
          buyPrice: 580,
          currentPrice: 600,
          marketValue: 60000,
          totalCost: 58162,
          stockProfit: 1838,
          profitRate: 3.16,
          note: '跌破月線停損停利',
          buyDate: '2025/08/11',
        },
        {
          assetId: 'UUID12',
          stockId: '2330',
          stockName: '台積電',
          quantity: 100,
          buyPrice: 580,
          currentPrice: 600,
          marketValue: 60000,
          totalCost: 58162,
          stockProfit: 1838,
          profitRate: 3.16,
          note: '跌破月線停損停利',
          buyDate: '2025/08/11',
        },
      ],
      pagination: {
        total_page: 3,
        current_page: 1,
      },
    },
  }),
};

export const addAssets = {
  url: '/api/v1/assets/new-asset',
  method: 'post',
  response: () => ({
    status: true,
    message: '成功新增資產',
  }),
};

export const editAssets = {
  url: '/api/v1/assets/:assetId',
  method: 'patch',
  response: () => ({
    status: true,
    message: '編輯成功',
  }),
};

export const deleteAssets = {
  url: '/api/v1/assets/:assetId',
  method: 'delete',
  response: () => ({
    status: true,
    message: '刪除成功',
  }),
};

export const sellAssets = {
  url: '/api/v1/assets/:assetId',
  method: 'post',
  response: () => ({
    status: true,
    message: '賣出成功',
  }),
};
