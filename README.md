# 📖 AI 英语精读助手 (AI English Intensive Reading Assistant)

一款基于 DeepSeek AI 驱动的英语精读学习工具，深度集成“一元一辅切”阅读法，旨在帮助英语学习者通过 AI 辅助，实现对英文长难句、新闻、小说的深度拆解与沉浸式学习。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-orange.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.8-blue.svg)](https://element-plus.org/)

---

## 🧭 什么是“一元一辅切”？

本工具核心逻辑基于高效的英语阅读法：
- **一元**：识别句子的核心谓词（主干）。
- **一辅**：识别修饰成分（从句、介词短语等辅助成分）。
- **一切**：通过语义切分，将长难句化整为零。

AI 会自动根据此方法对您粘贴的内容进行分段、切句、并提取核心词汇。

---

## ✨ 核心特性

- **🤖 AI 深度分析**：调用 DeepSeek 模型，实时生成“一元一辅切”分析结果，包含精准翻译与音标。
- **🌊 流式交互体验**：采用 SSE 流式输出技术，分析结果实时滚动，无需漫长等待。
- **🔊 沉浸式朗读**：
  - **全文模式**：支持一键连读，具备暂停、继续、停止功能。
  - **单句点读**：点击句子即可精准发音。
  - **单词跟读**：词卡内置发音按钮。
- **🔍 智能交互词卡**：鼠标悬停单词即可弹出详细释义，支持一键收藏。
- **📔 数字化生词本**：自动持久化存储生词，支持模糊搜索，构建个人专属词库。
- **🌗 极致视觉体验**：完美支持深色模式、浅色模式及系统自动跟随。
- **📄 学习资料导出**：支持将分析结果导出为 **HTML** 或 **Markdown**，方便打印或导入 Notion/Obsidian。

---

## 🛠️ 技术实现

### 前端架构
- **框架**: Vue 3 (Composition API) + TypeScript
- **构建**: Vite + SCSS
- **状态**: Pinia (持久化存储用户设置与词库)
- **UI**: Element Plus (响应式布局)
- **API**: 原生 Fetch (用于流式处理) + Axios

### 关键目录
```text
src/
├── api/          # DeepSeek API 封装与流式逻辑
├── components/   # 核心组件（词卡、结果展示、设置弹窗）
├── stores/       # Pinia 状态管理（配置、生词本、缓存）
├── utils/        # 语音合成封装、Storage 封装
├── views/        # 首页与生词本视图
└── types/        # 严谨的 TypeScript 类型定义
```

---

## 🚀 快速上手

### 1. 本地运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 配置 API Key
1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/) 获取 API Key。
2. 在应用右上角点击 **设置**。
3. 输入 API Key 并点击 **测试连接**。

---

## 🔒 安全与隐私

本项目采用 **BYOK (Bring Your Own Key)** 架构，极度重视隐私：
- **Key 安全**：您的 API Key 仅存储在浏览器本地 `localStorage` 中。
- **无中转**：所有请求直接从浏览器发往 DeepSeek 官方接口，无后端中转，不存在 Key 被窃取的风险。
- **纯静态**：项目可完全离线运行（除 AI 分析请求外）。

---

## 📦 部署指南

### GitHub Pages 部署 (推荐)
本项目已预置 GitHub Actions 自动化部署脚本：
1. 在 GitHub 仓库设置中，进入 **Settings > Pages**。
2. 将 **Build and deployment > Source** 改为 **GitHub Actions**。
3. 推送代码至 `main` 分支，系统将自动使用 **Node.js 24** 进行构建并发布。

---

## 📄 开源协议

基于 [MIT](LICENSE) 协议开源。
