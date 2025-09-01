export const login = {
  url: '/api/v1/users/auth/google',
  method: 'get',
  response: () => ({
    status: true,
    message: '登入成功',
    data: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNlcmlzIiwiaWF0IjoxNTE2MjM5MDIyfQ.FDWzRsZZBthPDozwNEgF6qrSR7hYMyfHh6taJ16ytqA',
      user: {
        id: 'uuid-1234',
        name: '陳大大',
        nickname: '有事也喝水',
        email: 'ogsmj116@gmail.com',
        avatar_url: 'https://xxx.com/avatar.jpg',
        role: 'guest',
        upgrade_status: 'trial',
        is_active: true,
      },
    },
  }),
};

export const loginCheck = {
  url: '/api/v1/users/check',
  method: 'get',
  response: () => ({
    status: true,
    message: '驗證成功',
    data: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNlcmlzIiwiaWF0IjoxNTE2MjM5MDIyfQ.FDWzRsZZBthPDozwNEgF6qrSR7hYMyfHh6taJ16ytqA',
      user: {
        id: 'uuid-1234',
        name: '陳大大',
        nickname: '有事也喝水',
        email: 'ogsmj116@gmail.com',
        avatar_url: 'https://xxx.com/avatar.jpg',
        role: 'guest',
        upgrade_status: 'trial',
        is_active: true,
      },
    },
  }),
};
