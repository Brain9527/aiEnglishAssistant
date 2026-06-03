<script setup lang="ts">
import type { AnalysisResult } from '../types';
import WordCard from './WordCard.vue';
import { speechService } from '../utils/speech';
import { Microphone } from '@element-plus/icons-vue';

const props = defineProps<{
  result: AnalysisResult;
}>();

const speakSentence = (sentence: string) => {
  speechService.speak(sentence);
};
</script>

<template>
  <div class="result-display">
    <div v-for="(paragraph, pIdx) in result.paragraphs" :key="pIdx" class="paragraph">
      <div v-for="(segment, sIdx) in paragraph.segments" :key="sIdx" class="segment">
        <div class="sentence-row">
          <div class="sentence-content">
            <span class="en-sentence">{{ segment.sentence }}</span>
            <el-button 
              link 
              type="primary" 
              @click="speakSentence(segment.sentence)"
              class="speak-btn"
            >
              <el-icon><Microphone /></el-icon>
              朗读句子
            </el-button>
          </div>
          <div class="zh-translation">中文：{{ segment.translation }}</div>
        </div>

        <div class="words-row">
          <template v-for="(word, wIdx) in segment.words" :key="wIdx">
            <el-popover
              placement="top"
              :width="200"
              trigger="hover"
            >
              <template #reference>
                <span class="word-item">{{ word.word }}</span>
              </template>
              <WordCard :word="word" />
            </el-popover>
            <span v-if="wIdx < segment.words.length - 1" class="word-sep">/</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-display {
  padding: 20px;
  line-height: 1.6;
}

.paragraph {
  margin-bottom: 30px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.segment {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed var(--el-border-color-lighter);
}

.segment:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.sentence-row {
  margin-bottom: 12px;
}

.sentence-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 4px;
}

.en-sentence {
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.speak-btn {
  padding: 0;
  height: auto;
  font-size: 0.9rem;
  margin-top: 4px;
}

.zh-translation {
  font-size: 0.95rem;
  color: var(--el-text-color-secondary);
  font-style: italic;
}

.words-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  background-color: var(--el-fill-color-light);
  padding: 8px 12px;
  border-radius: 4px;
}

.word-item {
  cursor: pointer;
  color: var(--el-color-primary);
  font-weight: 500;
  transition: all 0.2s;
  padding: 2px 4px;
  border-radius: 4px;
}

.word-item:hover {
  background-color: var(--el-color-primary-light-9);
  text-decoration: underline;
}

.word-sep {
  color: var(--el-text-color-placeholder);
  margin: 0 2px;
}
</style>
