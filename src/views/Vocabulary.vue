<script setup lang="ts">
import { useVocabularyStore } from '../stores/vocabulary';
import { speechService } from '../utils/speech';
import { Delete, Microphone, Search } from '@element-plus/icons-vue';
import { ref, computed } from 'vue';

const vocabularyStore = useVocabularyStore();
const searchQuery = ref('');

const filteredWords = computed(() => {
  if (!searchQuery.value) return vocabularyStore.words;
  const q = searchQuery.value.toLowerCase();
  return vocabularyStore.words.filter((w: any) => 
    w.word.toLowerCase().includes(q) || 
    w.meaning.toLowerCase().includes(q)
  );
});

const playWord = (text: string) => {
  speechService.speak(text);
};

const removeWord = (text: string) => {
  vocabularyStore.removeWord(text);
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString();
};
</script>

<template>
  <div class="vocabulary-view">
    <div class="vocab-header">
      <h2>我的生词本 ({{ vocabularyStore.words.length }})</h2>
      <el-input
        v-model="searchQuery"
        placeholder="搜索单词或释义..."
        style="width: 300px"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="vocab-content">
      <el-table :data="filteredWords" style="width: 100%" stripe>
        <el-table-column prop="word" label="单词" min-width="120">
          <template #default="{ row }">
            <span class="word-text">{{ row.word }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phonetic" label="音标" min-width="120" />
        <el-table-column prop="meaning" label="释义" min-width="200" />
        <el-table-column prop="createTime" label="添加时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                circle 
                size="small" 
                @click="playWord(row.word)"
              >
                <el-icon><Microphone /></el-icon>
              </el-button>
              <el-button 
                circle 
                size="small" 
                type="danger" 
                @click="removeWord(row.word)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <el-empty v-if="filteredWords.length === 0" description="暂无单词" />
    </div>
  </div>
</template>

<style scoped>
.vocabulary-view {
  padding: 20px 12px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--el-bg-color);
  min-height: 100%;
}

@media (max-width: 768px) {
  .vocab-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .vocab-header .el-input {
    width: 100% !important;
  }
}

.vocab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.vocab-header h2 {
  margin: 0;
}

.word-text {
  font-weight: bold;
  color: var(--el-color-primary);
}

.vocab-content {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);
}
</style>
