<script setup lang="ts">
import { ref } from 'vue';
import { useSettingsStore } from '../stores/settings';
import { useAnalysisStore } from '../stores/analysis';
import { analyzeTextStream } from '../api/deepseek';
import { speechService } from '../utils/speech';
import ResultDisplay from '../components/ResultDisplay.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  VideoPlay, Delete, Microphone, VideoPause, 
  CircleClose, Download, Loading 
} from '@element-plus/icons-vue';

const settingsStore = useSettingsStore();
const analysisStore = useAnalysisStore();

const inputText = ref(analysisStore.lastInput);
const analyzing = ref(false);
const streamText = ref('');
const isPlaying = ref(false);
const isPaused = ref(false);

const handleAnalyze = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入英文内容');
    return;
  }
  if (!settingsStore.apiKey) {
    ElMessage.warning('请先在设置中配置 API Key');
    return;
  }

  analyzing.value = true;
  streamText.value = '';
  analysisStore.lastInput = inputText.value;

  try {
    const result = await analyzeTextStream(
      inputText.value,
      settingsStore.apiKey,
      settingsStore.apiUrl,
      settingsStore.model,
      (chunk) => {
        streamText.value = chunk;
      }
    );
    analysisStore.setResult(result);
  } catch (error: any) {
    console.error('Analysis error:', error);
    ElMessage({
      message: `分析失败: ${error.message || '未知错误'}。请检查 API Key 和网络连接。`,
      type: 'error',
      duration: 5000
    });
  } finally {
    analyzing.value = false;
  }
};

const handleClear = () => {
  ElMessageBox.confirm('确定要清空内容吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    inputText.value = '';
    analysisStore.clear();
  });
};

const speakAll = async () => {
  if (!analysisStore.lastResult) return;
  isPlaying.value = true;
  isPaused.value = false;

  const sentences: string[] = [];
  analysisStore.lastResult.paragraphs.forEach((p: any) => {
    p.segments.forEach((s: any) => {
      sentences.push(s.sentence);
    });
  });

  for (const sentence of sentences) {
    if (!isPlaying.value) break;
    await speechService.speak(sentence);
  }
  isPlaying.value = false;
};

const pauseSpeak = () => {
  speechService.pause();
  isPaused.value = true;
};

const resumeSpeak = () => {
  speechService.resume();
  isPaused.value = false;
};

const stopSpeak = () => {
  speechService.stop();
  isPlaying.value = false;
  isPaused.value = false;
};

const exportHTML = () => {
  if (!analysisStore.lastResult) return;
  const content = document.querySelector('.result-container')?.innerHTML || '';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>AI英语精读分析</title>
      <style>
        body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        .paragraph { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px; }
        .en-sentence { font-size: 1.2em; font-weight: bold; }
        .zh-translation { color: #666; margin-bottom: 10px; }
        .words-row { color: #409eff; font-weight: 500; }
      </style>
    </head>
    <body>
      <h1>AI英语精读分析</h1>
      ${content}
    </body>
    </html>
  `;
  downloadFile(html, 'analysis.html', 'text/html');
};

const exportMarkdown = () => {
  if (!analysisStore.lastResult) return;
  let md = '# AI英语精读分析\n\n';
  analysisStore.lastResult.paragraphs.forEach((p: any, pIdx: number) => {
    md += `## 段落 ${pIdx + 1}\n\n`;
    p.segments.forEach((s: any) => {
      md += `### ${s.sentence}\n`;
      md += `**翻译**: ${s.translation}\n\n`;
      md += `**词汇**: \n`;
      s.words.forEach((w: any) => {
        md += `- **${w.word}** [${w.phonetic}]: ${w.meaning}\n`;
      });
      md += '\n---\n\n';
    });
  });
  downloadFile(md, 'analysis.md', 'text/markdown');
};

const downloadFile = (content: string, fileName: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="home-view">
    <div class="left-panel">
      <el-input
        v-model="inputText"
        type="textarea"
        placeholder="在此粘贴英文内容（小说、新闻、技术文章等）..."
        class="english-input"
        resize="none"
      />
    </div>

    <div class="right-panel">
      <div class="toolbar">
        <el-button-group>
          <el-button 
            type="primary" 
            :loading="analyzing" 
            @click="handleAnalyze"
          >
            <el-icon><VideoPlay /></el-icon>
            开始分析
          </el-button>
          <el-button @click="handleClear">
            <el-icon><Delete /></el-icon>
            清空
          </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <el-button-group v-if="analysisStore.lastResult">
          <el-button v-if="!isPlaying" type="success" @click="speakAll">
            <el-icon><Microphone /></el-icon>
            全文朗读
          </el-button>
          <template v-else>
            <el-button v-if="!isPaused" type="warning" @click="pauseSpeak">
              <el-icon><VideoPause /></el-icon>
              暂停
            </el-button>
            <el-button v-else type="success" @click="resumeSpeak">
              <el-icon><VideoPlay /></el-icon>
              继续
            </el-button>
            <el-button type="danger" @click="stopSpeak">
              <el-icon><CircleClose /></el-icon>
              停止
            </el-button>
          </template>
        </el-button-group>

        <el-divider direction="vertical" v-if="analysisStore.lastResult" />

        <el-dropdown v-if="analysisStore.lastResult">
          <el-button>
            导出<el-icon class="el-icon--right"><Download /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="exportHTML">导出 HTML</el-dropdown-item>
              <el-dropdown-item @click="exportMarkdown">导出 Markdown</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="result-container" v-loading="analyzing" element-loading-text="AI正在深度分析中...">
        <template v-if="analysisStore.lastResult">
          <ResultDisplay :result="analysisStore.lastResult" />
        </template>
        <template v-else-if="analyzing">
          <div class="analyzing-status">
            <el-empty description="正在生成分析结果...">
              <template #image>
                <el-icon class="is-loading" :size="50"><Loading /></el-icon>
              </template>
            </el-empty>
          </div>
        </template>
        <template v-else>
          <el-empty description="请输入内容并点击“开始分析”" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  height: calc(100vh - var(--header-height));
}

@media (max-width: 768px) {
  .home-view {
    flex-direction: column;
    overflow-y: auto;
    height: calc(100vh - var(--header-height));
  }
}

.left-panel {
  flex: 1;
  border-right: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

@media (max-width: 768px) {
  .left-panel {
    border-right: none;
    border-bottom: 1px solid var(--el-border-color-light);
    flex: none;
    height: 40%;
  }
}

.english-input :deep(.el-textarea__inner) {
  flex: 1;
  height: 100%;
  border: none;
  border-radius: 0;
  padding: 20px;
  font-size: 1.1rem;
  line-height: 1.6;
  background-color: var(--el-bg-color);
}

.right-panel {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color-page);
  min-height: 0;
}

@media (max-width: 768px) {
  .right-panel {
    flex: 1;
  }
}

.toolbar {
  padding: 8px 12px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.result-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 50px;
}

.analyzing-status {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
