<script setup lang="ts">
import { useVocabularyStore } from '../stores/vocabulary';
import { speechService } from '../utils/speech';
import type { Word } from '../types';
import { Star, StarFilled, Microphone } from '@element-plus/icons-vue';

const props = defineProps<{
  word: Word;
}>();

const vocabularyStore = useVocabularyStore();

const toggleVocabulary = () => {
  if (vocabularyStore.hasWord(props.word.word)) {
    vocabularyStore.removeWord(props.word.word);
  } else {
    vocabularyStore.addWord(props.word);
  }
};

const playPronunciation = () => {
  speechService.speak(props.word.word);
};
</script>

<template>
  <div class="word-card">
    <div class="word-header">
      <span class="word-text">{{ word.word }}</span>
      <div class="word-actions">
        <el-button 
          circle 
          size="small" 
          @click="playPronunciation"
        >
          <el-icon><Microphone /></el-icon>
        </el-button>
        <el-button 
          circle 
          size="small" 
          @click="toggleVocabulary"
        >
          <el-icon v-if="vocabularyStore.hasWord(word.word)"><StarFilled color="#f7ba2a" /></el-icon>
          <el-icon v-else><Star /></el-icon>
        </el-button>
      </div>
    </div>
    <div class="word-phonetic">{{ word.phonetic }}</div>
    <div class="word-meaning">{{ word.meaning }}</div>
  </div>
</template>

<style scoped>
.word-card {
  padding: 8px;
  min-width: 150px;
}

.word-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.word-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--el-color-primary);
}

.word-actions {
  display: flex;
  gap: 4px;
}

.word-phonetic {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.word-meaning {
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--el-text-color-primary);
}
</style>
