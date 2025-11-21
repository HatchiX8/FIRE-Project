export const addReports = {
  url: '/api/v1/dashboard/new-reports',
  method: 'post',
  response: () => ({
    status: true,
    message: '新增成功',
  }),
};
