<script setup lang="ts">
import { ref } from 'vue';
import { useSettingsStore } from '../stores/settings';
import { testConnection } from '../api/deepseek';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const settingsStore = useSettingsStore();
const testing = ref(false);

const handleClose = () => {
  emit('update:modelValue', false);
};

const handleTest = async () => {
  if (!settingsStore.apiKey) {
    ElMessage.warning('请先填写 API Key');
    return;
  }
  testing.value = true;
  try {
    const success = await testConnection(
      settingsStore.apiKey,
      settingsStore.apiUrl,
      settingsStore.model
    );
    if (success) {
      ElMessage.success('✅ API连接成功');
    } else {
      ElMessage.error('❌ API连接失败');
    }
  } catch (error) {
    ElMessage.error('❌ API连接失败');
  } finally {
    testing.value = false;
  }
};
</script>

<template>
  <el-dialog
    title="系统设置"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    width="500px"
    destroy-on-close
  >
    <el-form label-position="top">
      <el-form-item label="DeepSeek API Key">
        <el-input 
          v-model="settingsStore.apiKey" 
          placeholder="请输入您的 API Key" 
          show-password
        />
      </el-form-item>
      <el-form-item label="API 地址">
        <el-input 
          v-model="settingsStore.apiUrl" 
          placeholder="https://api.deepseek.com/chat/completions" 
        />
      </el-form-item>
      <el-form-item label="模型选择">
        <el-select v-model="settingsStore.model" style="width: 100%">
          <el-option label="deepseek-chat" value="deepseek-chat" />
          <el-option label="deepseek-reasoner" value="deepseek-reasoner" />
        </el-select>
      </el-form-item>
      <el-form-item label="主题模式">
        <el-radio-group v-model="settingsStore.theme">
          <el-radio-button label="light">浅色</el-radio-button>
          <el-radio-button label="dark">深色</el-radio-button>
          <el-radio-button label="auto">跟随系统</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="testing" @click="handleTest">测试连接</el-button>
        <el-button type="primary" @click="handleClose">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
