/**
 * Prompt loader utility.
 *
 * Reads prompt templates from .txt files and replaces {{placeholders}}.
 * This keeps prompts separate from application code as required by AGENTS.md.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const TEMPLATES_DIR = join(import.meta.dirname ?? ".", "templates");

// Cache loaded templates in memory (prompts don't change at runtime)
const templateCache = new Map<string, string>();

/**
 * Load a prompt template by name.
 * Caches the result after first read.
 */
function loadTemplate(name: string): string {
  if (templateCache.has(name)) {
    return templateCache.get(name)!;
  }

  const filePath = join(TEMPLATES_DIR, `${name}.txt`);
  const content = readFileSync(filePath, "utf-8").trim();
  templateCache.set(name, content);
  return content;
}

/**
 * Replace {{placeholder}} markers in a template with actual values.
 *
 * @param template - The template string containing {{placeholders}}
 * @param values - Object mapping placeholder names to replacement values
 * @returns The resolved prompt string
 */
function resolvePlaceholders(
  template: string,
  values: Record<string, unknown>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = values[key];
    if (value === undefined || value === null) {
      return "N/A";
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  });
}

/**
 * Load a prompt template and resolve its placeholders.
 *
 * @param name - Template name (without .txt extension)
 * @param values - Placeholder values to inject
 * @returns The fully resolved prompt ready for use
 *
 * @example
 * const prompt = loadPrompt("intent", { query: "I need a room near KNUST" });
 */
export function loadPrompt(
  name: string,
  values: Record<string, unknown> = {}
): string {
  const template = loadTemplate(name);
  return resolvePlaceholders(template, values);
}

/**
 * Clear the template cache (useful for development/testing).
 */
export function clearPromptCache(): void {
  templateCache.clear();
}
