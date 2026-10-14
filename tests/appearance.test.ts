import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../src/components/ui/globals.css", import.meta.url), "utf8");
const light = css.split("@theme inline")[0];
function token(theme: string, name: string) {
  const value = theme.match(new RegExp(`--${name}: (#[0-9A-Fa-f]{6});`))?.[1];
  assert.ok(value, `Missing color token: ${name}`);
  return value;
}
function luminance(color: string) {
  const channels = [1, 3, 5].map((offset) => {
    const value = Number.parseInt(color.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(foreground: string, background: string) {
  const [low, high] = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
  return (high + 0.05) / (low + 0.05);
}

test("small text and action labels retain readable contrast in light mode", () => {
  for (const theme of [light]) {
    for (const [foreground, background] of [
      ["ink", "page"], ["ink-2", "surface"], ["ink-2", "canvas"],
    ]) {
      assert.ok(contrast(token(theme, foreground), token(theme, background)) >= 4.5, `${foreground}/${background}`);
    }
  }
  for (const [foreground, background] of [
    ["ink-2", "lavender"], ["ink-2", "hover-2"], ["red", "red-tint"],
    ["green", "green-tint"], ["orange", "orange-tint"], ["accent-ink", "primary-tint"],
    ["info-ink", "info-tint"], ["ink", "lime"], ["ink", "cyan"], ["ink", "yellow"],
  ]) {
    assert.ok(contrast(token(light, foreground), token(light, background)) >= 4.5, `${foreground}/${background}`);
  }
});


test("white filled-action labels meet large bold text contrast", () => {
  const styles = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const labels = styles.match(/\.button-primary,\s*\.button-danger\s*\{([^}]+)\}/)?.[1];
  assert.ok(labels);
  assert.match(labels, /font-size: 19px/);
  assert.match(styles, /\.button\s*\{[^}]*font-weight: 750/);
  for (const [foreground, background] of [
    ["primary-foreground", "primary"], ["primary-foreground", "primary-hover"],
    ["destructive-foreground", "destructive"], ["destructive-foreground", "destructive-hover"],
  ]) {
    assert.equal(token(light, foreground), "#FFFFFF");
    assert.ok(contrast(token(light, foreground), token(light, background)) >= 3, `${foreground}/${background}`);
  }
});
