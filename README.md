# AI 英语精读助手 (AI English Intensive Reading Assistant)

一款基于 AI 驱动的英语精读学习工具，采用“一元一辅切”阅读法，帮助用户深度理解英文内容。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/vue-3.5-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)
![Vite](https://img.shields.io/badge/vite-6.0-orange.svg)

## 🌟 核心特性

- **一元一辅切分析**：利用 DeepSeek API 对英文文本进行语义拆解，提供段落、句子、词汇三级深度分析。
- **流式渲染**：实时展示 AI 分析过程，无需长时间等待。
- **多维度发音**：支持全文朗读、单句点读、单词发音，具备完善的播放控制（暂停/继续/停止）。
- **智能词卡**：鼠标悬停单词即可查看音标与中文释义，支持一键加入生词本。
- **生词本系统**：自动保存生词，支持按词义搜索与持久化存储。
- **现代化 UI**：ChatGPT 风格的侧边交互布局，支持深色/浅色/系统跟随模式。
- **数据导出**：支持将分析结果一键导出为 HTML 或 Markdown 格式，方便离线复习。

## 🛠️ 技术栈

- **Frontend**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Framework**: Element Plus
- **State Management**: Pinia
- **HTTP Client**: Axios / Native Fetch (Stream)
- **Router**: Vue Router
- **Style**: SCSS / CSS Variables

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd aiEnglishAssistant
```

### 2. 安装依赖
```bash
npm install
```

### 3. 运行开发服务器
```bash
npm run dev
```

### 4. 配置 API
打开浏览器访问 `http://localhost:5173`，点击右上角设置图标，填入您的 **DeepSeek API Key** 即可开始使用。

## 🔒 安全性说明

本项目采用 **BYOK (Bring Your Own Key)** 模式：
- **无后端存储**：您的 API Key 仅存储在浏览器的 `localStorage` 中，不会上传到任何第三方服务器。
- **直接通信**：API 请求直接从您的浏览器发送至 DeepSeek 官方接口。
- **开源透明**：所有源码公开，您可以随时检查代码中是否存在 Key 泄露风险。

## 📦 部署建议

由于本项目是纯静态应用，您可以轻松部署到以下平台：
- Vercel / Netlify / Cloudflare Pages
- GitHub Pages
- 私有服务器 (Nginx / Apache)

## 📄 开源协议

基于 [MIT](LICENSE) 协议开源。
