import axios from 'axios';
import type { AnalysisResult } from '../types';

export async function testConnection(apiKey: string, apiUrl: string, model: string) {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: model,
        messages: [{ role: 'user', content: '你好' }],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

export async function analyzeTextStream(
  text: string,
  apiKey: string,
  apiUrl: string,
  model: string,
  onChunk: (content: string) => void
): Promise<AnalysisResult> {
  const prompt = `你是一名专业英语教师。
请按照“一元一辅切”的英语阅读方法分析下面内容。
要求：
1. 保留原段落结构
2. 按语义切分句子
3. 输出中文翻译
4. 输出每个单词
5. 输出每个单词音标
6. 输出每个单词中文释义
7. 必须仅返回 JSON 格式，不要包含任何 Markdown 代码块标记（如 \`\`\`json）或额外的解释文字。

返回格式示例：
{
"paragraphs":[
{
"segments":[
{
"sentence":"When I was young",
"translation":"当我年轻的时候",
"words":[
{
"word":"When",
"phonetic":"/wen/",
"meaning":"当……时候"
},
{
"word":"I",
"phonetic":"/aɪ/",
"meaning":"我"
}
]
}
]
}
]
}

英文内容：
${text}`;

  const requestPayload: any = {
    model: model,
    messages: [{ role: 'user', content: prompt }],
    stream: true
  };

  // Only add response_format if model is not reasoner (as some reasoner models don't support it)
  if (!model.includes('reasoner')) {
    requestPayload.response_format = { type: 'json_object' };
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestPayload)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  let buffer = '';

  if (!reader) throw new Error('Failed to get reader');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep the last partial line in buffer

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

      const data = trimmedLine.slice(6);
      if (data === '[DONE]') break;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices[0].delta.content || '';
        fullContent += content;
        onChunk(fullContent);
      } catch (e) {
        // Handle potential parsing errors for individual stream chunks
      }
    }
  }

  // Helper to extract JSON if model wraps it in markdown code blocks
  const extractJSON = (str: string) => {
    const jsonMatch = str.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : str;
  };

  try {
    const cleanedContent = extractJSON(fullContent);
    return JSON.parse(cleanedContent) as AnalysisResult;
  } catch (e) {
    console.error('Final JSON parsing failed. Content:', fullContent);
    throw new Error('分析结果解析失败，请重试');
  }
}
