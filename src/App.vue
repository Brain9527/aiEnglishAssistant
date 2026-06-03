<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSettingsStore } from './stores/settings';
import SettingsDialog from './components/SettingsDialog.vue';
import { Moon, Sunny, Setting, Notebook, Reading, Monitor } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const settingsStore = useSettingsStore();
const settingsVisible = ref(false);

const toggleTheme = () => {
  if (settingsStore.theme === 'light') {
    settingsStore.theme = 'dark';
  } else if (settingsStore.theme === 'dark') {
    settingsStore.theme = 'auto';
  } else {
    settingsStore.theme = 'light';
  }
};

const goToVocabulary = () => {
  router.push('/vocabulary');
};

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="logo" @click="goToHome">
        <el-icon><Reading /></el-icon>
        <span>AI英语精读助手</span>
      </div>
      <div class="header-actions">
        <el-button-group>
          <el-button 
            :type="route.path === '/' ? 'primary' : ''" 
            @click="goToHome"
          >首页</el-button>
          <el-button 
            :type="route.path === '/vocabulary' ? 'primary' : ''" 
            @click="goToVocabulary"
          >
            <el-icon><Notebook /></el-icon>
            生词本
          </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <el-button circle @click="toggleTheme">
          <el-icon v-if="settingsStore.theme === 'light'"><Sunny /></el-icon>
          <el-icon v-else-if="settingsStore.theme === 'dark'"><Moon /></el-icon>
          <el-icon v-else><Monitor /></el-icon>
        </el-button>

        <el-button circle @click="settingsVisible = true">
          <el-icon><Setting /></el-icon>
        </el-button>
      </div>
    </el-header>

    <el-main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>

    <SettingsDialog v-model="settingsVisible" />
  </el-container>
</template>

<style>
:root {
  --header-height: 60px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 20px;
  background-color: var(--el-bg-color);
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  color: var(--el-color-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-main {
  padding: 0;
  flex: 1;
  overflow: hidden;
  background-color: var(--el-bg-color-page);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global Styles for Dark Mode */
html.dark {
  color-scheme: dark;
}
</style>
