// API Configuration for AIME Medical Application
export const API_CONFIG = {
  OPENAI_API_KEY: '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',
  OPENAI_BASE_URL: 'https://api.openai.com/v1',
  OPENAI_MODEL: 'gpt-4',
  OPENAI_MAX_TOKENS: 2000,
  OPENAI_TEMPERATURE: 0.7,
};

// Validate API configuration
export const validateApiConfig = (): boolean => {
  if (!API_CONFIG.OPENAI_API_KEY || API_CONFIG.OPENAI_API_KEY === '') {
    console.error('OpenAI API key is not configured');
    return false;
  }
  return true;
};

// Get API status
export const getApiStatus = () => {
  return {
    openai: validateApiConfig(),
    configured: validateApiConfig(),
  };
};