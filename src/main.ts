import './assets/main.css';
import 'uno.css';

import { createApp, h } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { withNaiveProviders } from './plugins/naive';

const app = createApp({
  render: () => withNaiveProviders(h(App)),
});

app.use(createPinia());
app.use(router);

app.mount('#app');
