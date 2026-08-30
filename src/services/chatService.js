import { get, post } from "../utils/APIClient";
import ENDPOINTS from "../utils/APIEndpoint";

/**
 * Fetch all conversations for the current user.
 */
export const getConversations = () => {
  return get(ENDPOINTS.CONVERSATIONS);
};

export const startConversation = (userId) => {
  return post(ENDPOINTS.CONVERSATIONS, { user_id: userId });
};

/**
 * Fetch messages for a given conversation.
 * @param {string|number} conversationId
 */
export const getMessages = (conversationId) => {
  return get(`${ENDPOINTS.MESSAGES}/${conversationId}/messages`);
};

/**
 * Send a message in a given conversation.
 * @param {string|number} conversationId
 * @param {string} text
 */
export const sendMessage = (conversationId, text) => {
  return post(`${ENDPOINTS.MESSAGES}/${conversationId}/messages`, {
    message: text,
  });
};
