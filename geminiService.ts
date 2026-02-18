
import { GoogleGenAI } from "@google/genai";

/**
 * Сервис диагностики на базе Google Gemini API.
 * Анализирует логи и телеметрию постомата для выявления неисправностей.
 */
export const getDiagnosticSummary = async (deviceLogs: string, telemetry: string) => {
  // Инициализация клиента Gemini API. API ключ берется из переменных окружения.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Используем модель gemini-3-flash-preview для быстрой и точной диагностики на основе текста
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Вы — профессиональный инженер по обслуживанию сети постоматов. 
      Ваша задача — проанализировать предоставленные данные (логи и телеметрию) и предоставить краткий диагностический отчет.
      
      Данные для анализа:
      Логи устройств: ${deviceLogs}
      Телеметрия: ${telemetry}
      
      Требования к ответу:
      - Язык: Русский
      - Формат: Маркированный список (bullet points)
      - Тон: Профессиональный и лаконичный
      - Содержание: Укажите на аномалии, критические ошибки и дайте рекомендации по исправлению.`,
    });
    
    // Возвращаем текст из ответа (используем свойство .text согласно документации SDK)
    return response.text;
  } catch (error) {
    console.error("Diagnostic Error:", error);
    return "Не удалось получить аналитические данные от AI. Проверьте подключение к сервису.";
  }
};
