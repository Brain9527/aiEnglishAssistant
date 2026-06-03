import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { storage } from '../utils/storage';

export const useSettingsStore = defineStore('settings', () => {
  const apiKey = ref(storage.get<string>('deepseek_api_key') || '');
  const apiUrl = ref(storage.get<string>('deepseek_api_url') || 'https://api.deepseek.com/chat/completions');
  const model = ref(storage.get<string>('deepseek_model') || 'deepseek-chat');
  const theme = ref(storage.get<'light' | 'dark' | 'auto'>('theme') || 'auto');

  watch(apiKey, (val) => storage.set('deepseek_api_key', val));
  watch(apiUrl, (val) => storage.set('deepseek_api_url', val));
  watch(model, (val) => storage.set('deepseek_model', val));
  watch(theme, (val) => {
    storage.set('theme', val);
    applyTheme(val);
  });

  const applyTheme = (t: 'light' | 'dark' | 'auto') => {
    const isDark = t === 'dark' || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  };

  // Initial apply
  applyTheme(theme.value);

  return {
    apiKey,
    apiUrl,
    model,
    theme,
    applyTheme
  };
});
