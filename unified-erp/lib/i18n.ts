export type Lang = 'ar' | 'en';

export const dict: Record<Lang, Record<string, string>> = {
  ar: {
    appTitle: 'نظام موحّد للعقارات والخزينة',
    login: 'تسجيل الدخول',
    dashboard: 'لوحة التحكم'
  },
  en: {
    appTitle: 'Unified Real Estate & Treasury ERP',
    login: 'Login',
    dashboard: 'Dashboard'
  }
};

export function t(key: string, lang: Lang = 'ar') {
  return dict[lang][key] ?? key;
}