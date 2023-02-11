import { Themes } from './themes.js';

/**
 * @typedef {object} ContentScript
 * @property {string} id
 * @property {Array<string>} matches
 * @property {Array<string>} [css]
 * @property {Array<string>} [js]
 */

/**
 * @param {import('./rule.js').Rule} rule
 * @returns {ContentScript}
 */
export function createContentScript(rule) {
  const theme = Themes[rule.theme];
  return {
    id: rule.id,
    matches: rule.matches,
    css: theme.css,
    js: theme.js,
  };
}

/**
 * @param {import('./rule.js').Rule} rule
 * @returns {Promise<void>}
 */
export async function registerContentScript(rule) {
  try {
    const contentScript = createContentScript(rule);
    await chrome.scripting.registerContentScripts([contentScript]);
  } catch (error) {
    throw new Error('Failed to Register Content Script', { cause: error });
  }
}

/**
 * @param {import('./rule.js').Rule} rule
 * @returns {Promise<void>}
 */
export async function updateContentScript(rule) {
  try {
    const contentScript = createContentScript(rule);
    await chrome.scripting.updateContentScripts([contentScript]);
  } catch (error) {
    throw new Error('Failed to Update Content Script', { cause: error });
  }
}

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function unregisterContentScript(id) {
  try {
    await chrome.scripting.unregisterContentScripts({ ids: [id] });
  } catch (error) {
    throw new Error('Failed to Unregister Content Script', { cause: error });
  }
}
