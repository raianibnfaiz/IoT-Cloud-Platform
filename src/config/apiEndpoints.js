const BASE_URL = 'https://cloud-platform-server-for-bjit.onrender.com';

const API_ENDPOINTS = {
  WIDGETS: `${BASE_URL}/widgets`,
  TEMPLATE_DETAILS: (templateId) => `${BASE_URL}/users/templates/${templateId}`,
  DELETE_VIRTUAL_PIN: (pinId, templateId) => `${BASE_URL}/users/templates/virtualPins/${pinId}?template_id=${templateId}`,
  UPDATE_TEMPLATE: (templateId) => `${BASE_URL}/users/templates/${templateId}`,
};

export { BASE_URL, API_ENDPOINTS };
