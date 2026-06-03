import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { storage } from '../utils/storage';
import type { AnalysisResult } from '../types';

export const useAnalysisStore = defineStore('analysis', () => {
  const lastInput = ref(storage.get<string>('last_input') || '');
  const lastResult = ref<AnalysisResult | null>(storage.get<AnalysisResult | null>('last_result') || null);

  watch(lastInput, (val) => storage.set('last_input', val));
  watch(lastResult, (val) => storage.set('last_result', val));

  const setResult = (result: AnalysisResult) => {
    lastResult.value = result;
  };

  const clear = () => {
    lastResult.value = null;
    lastInput.value = '';
  };

  return {
    lastInput,
    lastResult,
    setResult,
    clear
  };
});
