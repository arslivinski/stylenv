import { registerContentScript } from './content_script.js';

async function main() {
  try {
    // Unregister all content scripts
    await chrome.scripting.unregisterContentScripts();

    // Retrieve all the user rules
    const rules = await chrome.storage.sync.get();

    // Register them individually
    for (const rule of Object.values(rules)) {
      await registerContentScript(rule);
    }
  } catch (error) {
    console.error(new Error('Failed to initialize content scripts', { cause: error }));
  }
}

main();
