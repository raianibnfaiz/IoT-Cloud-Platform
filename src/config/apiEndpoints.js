const BASE_URL_LOCAL = 'http://localhost:3000';
const BASE_URL_REMOTE = 'https://cloud-platform-server-for-bjit.onrender.com';
const BASE_URL = BASE_URL_REMOTE;

const API_ENDPOINTS = {
  WIDGETS: `${BASE_URL}/widgets`,
  TEMPLATES: `${BASE_URL}/users/templates`,
  TEMPLATE_DETAILS: (templateId) => `${BASE_URL}/users/templates/${templateId}`,
  DELETE_VIRTUAL_PIN: (pinId, templateId) => `${BASE_URL}/users/templates/virtualPins/${pinId}?template_id=${templateId}`,
  UPDATE_TEMPLATE: (templateId) => `${BASE_URL}/users/templates/${templateId}`,
  UPDATE_VIRTUAL_PIN: (pinId, templateId) => `${BASE_URL}/users/templates/virtualPins/${pinId}?template_id=${templateId}`,
  LOGIN: `${BASE_URL}/users/login`,
};

export { BASE_URL, API_ENDPOINTS };
