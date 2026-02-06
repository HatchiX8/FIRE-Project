// 建立 Pinia 實例，使非setup也能使用
import { createPinia, setActivePinia, type Pinia } from 'pinia';

export const pinia: Pinia = createPinia();

// 讓非元件環境（例如 axios interceptor）也能用 useStore()
setActivePinia(pinia);
