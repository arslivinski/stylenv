import { registerContentScript, unregisterContentScript } from '../content_script.js';
import { Themes } from '../themes.js';
import { htm } from '../vendor/htm@3.1.1/dist/htm.module.js';
import { h, render } from '../vendor/preact@10.11.3/dist/preact.module.js';
import { useEffect, useState } from '../vendor/preact@10.11.3/hooks/dist/hooks.module.js';

const html = htm.bind(h);

/**
 * @type {Array<import('../themes.js').Theme>}
 */
const themes = Object.keys(Themes);

/**
 * @param {object} props
 * @param {Array<import('../rule.js').Rule>} props.rules
 * @param {(id: string) => void} props.onRemove
 */
function Rules({ rules, onRemove }) {
  if (rules.length === 0) {
    return false;
  }

  return html`
    <table class="rules" cellspacing="0">
      <thead>
        <tr>
          <th>URL</th>
          <th>Theme</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${rules.map(
          (rule) => html`
            <tr>
              <td>${rule.matches[0]}</td>
              <td>${rule.theme}</td>
              <td><button type="button" onClick=${() => onRemove(rule.id)}>Remove</button></td>
            </tr>
          `,
        )}
      </tbody>
    </table>
  `;
}

/**
 * @param {object} props
 * @param {(rule: import('../rule.js').Rule) => void} props.onSave
 * @param {() => void} props.onCancel
 */
function FormRule({ onSave, onCancel }) {
  /**
   * @type {[string, (id: string) => void]}
   */
  const [id] = useState(() => crypto.randomUUID());

  /**
   * @type {[string, (url: string) => void]}
   */
  const [url, setUrl] = useState('');

  /**
   * @type {[import('../themes.js').Theme, (theme: import('../themes.js').Theme) => void]}
   */
  const [theme, setTheme] = useState(themes[0]);

  function handleClickSave() {
    onSave({
      id,
      matches: [url],
      theme,
    });
  }

  function handleClickCancel() {
    onCancel();
  }

  return html`
    <div>
      <div class="form">
        <div class="form__group form__group--grow">
          <label for="url">URL</label>
          <input
            id="url"
            name="url"
            type="text"
            placeholder="https://*.google.com/*"
            value="${url}"
            onInput=${(event) => setUrl(event.target.value)}
          />
        </div>
        <div class="form__group">
          <label for="theme">Theme</label>
          <select id="theme" name="theme" value="${theme}" onChange=${(event) => setTheme(event.target.value)}>
            ${themes.map((option) => html`<option value=${option}>${option}</option>`)}
          </select>
        </div>
        <button type="button" onClick=${handleClickCancel}>Cancel</button>
        <button type="button" onClick=${handleClickSave}>Save</button>
      </div>
      <a href="https://developer.chrome.com/docs/extensions/mv3/match_patterns" target="_blank"
        >Learn more about match patterns</a
      >
    </div>
  `;
}

function useRules() {
  /**
   * @type {[Array<import('../rule.js').Rule>, (rules: Array<import('../rule.js').Rule>) => void]}
   */
  const [rules, setRules] = useState([]);

  async function loadRules() {
    const result = await chrome.storage.sync.get();
    setRules(Object.values(result));
  }

  /**
   * @param {import('../rule.js').Rule} rule
   */
  async function createRule(rule) {
    await registerContentScript(rule);
    await chrome.storage.sync.set({ [rule.id]: rule });
    await loadRules();
  }

  /**
   *
   * @param {string} id
   */
  async function removeRule(id) {
    await unregisterContentScript(id);
    await chrome.storage.sync.remove(id);
    await loadRules();
  }

  useEffect(() => {
    loadRules();
  }, []);

  return { rules, createRule, removeRule };
}

function Options() {
  const { rules, createRule, removeRule } = useRules();
  const [isAdding, setAdding] = useState(false);

  /**
   * @param {import('../rule.js').Rule} rule
   */
  async function handleSaveNewRule(rule) {
    try {
      await createRule(rule);
      setAdding(false);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCancelNewRule() {
    setAdding(false);
  }

  /**
   * @param {string} id
   */
  function handleRemoveRule(id) {
    removeRule(id);
  }

  function handleAddNewRule() {
    setAdding(true);
  }

  return html`
    <main class="content">
      <header>
        <h1 class="header">
          <img class="header__image" src="/icons/32x32.png" alt="Logo" />
          StylENV
        </h1>
      </header>
      <${Rules} rules=${rules} onRemove=${handleRemoveRule} />
      ${isAdding
        ? html`<${FormRule} onSave=${handleSaveNewRule} onCancel=${handleCancelNewRule} />`
        : html`<button type="button" onClick=${handleAddNewRule}>Add new rule</button>`}
    </main>
  `;
}

render(html`<${Options} />`, document.querySelector('#root'));
