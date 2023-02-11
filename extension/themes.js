/**
 * @typedef {'alice' | 'carrier' | 'shipper'} Theme
 */

/**
 * @typedef {object} ThemeEntry
 * @property {Array<string>} [css]
 * @property {Array<string>} [js]
 */

/**
 * @type {Record<Theme, ThemeEntry>}
 */
export const Themes = {
  alice: {
    css: ['themes/alice.css'],
  },
  border: {
    css: ['themes/border.css'],
  },
  carrier: {
    css: ['themes/carrier.css'],
  },
  shipper: {
    css: ['themes/shipper.css'],
  },
};
