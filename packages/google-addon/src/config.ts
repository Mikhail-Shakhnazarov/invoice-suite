/**
 * Configuration Management
 *
 * Handles storage and retrieval of user settings via PropertiesService.
 */

import type { AddonConfig } from './types.js';
import { DEFAULT_CONFIG } from './types.js';

const CONFIG_KEY = 'invoiceSuiteConfig';

/**
 * Load user configuration from PropertiesService.
 * Returns default config if none exists.
 */
export function loadConfig(): AddonConfig {
  try {
    const props = PropertiesService.getUserProperties();
    const stored = props.getProperty(CONFIG_KEY);

    if (!stored) {
      return { ...DEFAULT_CONFIG };
    }

    const parsed = JSON.parse(stored) as Partial<AddonConfig>;

    // Merge with defaults to handle missing fields from older versions
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      business: {
        ...DEFAULT_CONFIG.business,
        ...parsed.business,
      },
      defaults: {
        ...DEFAULT_CONFIG.defaults,
        ...parsed.defaults,
      },
    };
  } catch (error) {
    console.error('Failed to load config:', error);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Save user configuration to PropertiesService.
 */
export function saveConfig(config: AddonConfig): void {
  try {
    const props = PropertiesService.getUserProperties();
    props.setProperty(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save config:', error);
    throw new Error('Failed to save settings. Please try again.');
  }
}

/**
 * Check if configuration is complete enough to generate invoices.
 */
export function isConfigComplete(config: AddonConfig): {
  complete: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  if (!config.business.name) missing.push('Business Name');
  if (!config.business.address) missing.push('Business Address');
  if (!config.business.email) missing.push('Business Email');
  if (!config.templateDocId) missing.push('Template Document ID');

  return {
    complete: missing.length === 0,
    missing,
  };
}

/**
 * Reset configuration to defaults.
 */
export function resetConfig(): void {
  try {
    const props = PropertiesService.getUserProperties();
    props.deleteProperty(CONFIG_KEY);
  } catch (error) {
    console.error('Failed to reset config:', error);
  }
}
