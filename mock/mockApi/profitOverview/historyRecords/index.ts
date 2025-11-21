export const addReports = {
  url: '/api/v1/dashboard/new-reports',
  method: 'post',
  response: () => ({
    status: true,
    message: '新增成功',
  }),
};

export const editReports = {
  url: '/api/v1/dashboard/:tradesId',
  method: 'patch',
  response: () => ({
    status: true,
    message: '編輯成功',
  }),
};
