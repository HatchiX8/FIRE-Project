import './assets/main.css';
import 'uno.css';

import { createApp, h } from 'vue';
import { pinia } from './pinia';

import App from './App.vue';
import router from './router';
import { withNaiveProviders } from './plugins/naive';
import { createDiscreteApi } from 'naive-ui';
import { setNotifier, type NotifyLevel } from '@/utils/index'; // 引入 notify 工具

const app = createApp({
  render: () => withNaiveProviders(h(App)),
});

app.use(pinia);
app.use(router);

app.mount('#app');

// 建立全域提示功能
const { message } = createDiscreteApi(['message']);
setNotifier((level: NotifyLevel, msg: string) => {
  if (level === 'error') message.error(msg);
  else if (level === 'success') message.success(msg);
  else if (level === 'warning') message.warning(msg);
  else message.info(msg);
});
