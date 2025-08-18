import { h, type VNodeChild } from 'vue';
import {
  NConfigProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  zhTW,
  dateZhTW,
  darkTheme,
} from 'naive-ui';

export function withNaiveProviders(children: VNodeChild) {
  return h(
    NConfigProvider,
    { theme: darkTheme, locale: zhTW, dateLocale: dateZhTW },
    {
      default: () =>
        h(NLoadingBarProvider, null, {
          default: () =>
            h(NNotificationProvider, null, {
              default: () =>
                h(NDialogProvider, null, {
                  default: () => h(NMessageProvider, null, { default: () => children }),
                }),
            }),
        }),
    }
  );
}
