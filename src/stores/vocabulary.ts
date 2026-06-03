import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { storage } from '../utils/storage';
import type { VocabularyWord, Word } from '../types';

export const useVocabularyStore = defineStore('vocabulary', () => {
  const words = ref<VocabularyWord[]>(storage.get<VocabularyWord[]>('vocabulary_words') || []);

  watch(words, (val) => storage.set('vocabulary_words', val), { deep: true });

  const addWord = (word: Word) => {
    if (!words.value.find(w => w.word === word.word)) {
      words.value.push({
        ...word,
        createTime: Date.now()
      });
    }
  };

  const removeWord = (wordText: string) => {
    words.value = words.value.filter(w => w.word !== wordText);
  };

  const hasWord = (wordText: string) => {
    return words.value.some(w => w.word === wordText);
  };

  return {
    words,
    addWord,
    removeWord,
    hasWord
  };
});
