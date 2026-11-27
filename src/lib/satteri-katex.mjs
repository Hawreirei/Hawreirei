/**
 * KaTeX for Astro 7's default Markdown engine (Sätteri), issue #11.
 *
 * With `features: { math: true }`, Sätteri turns `$…$` into <code class="math-inline">
 * and `$$…$$` into <pre><code class="math-display">. This hast plugin swaps those for
 * KaTeX HTML rendered at build time, so visitors get finished math with no runtime JS.
 *
 * Why hast (not mdast): at the mdast stage a raw replacement is re-parsed as Markdown,
 * and KaTeX output can contain `_` / `*` that would turn into <em>. At the hast stage the
 * HTML is never re-read as Markdown.
 */
import { defineHastPlugin, htmlToHast } from 'satteri';
import katex from 'katex';

const OPTIONS = { throwOnError: false, output: 'htmlAndMathml', strict: 'ignore' };

const textOf = (node) =>
  (node.children ?? []).map((c) => (c.type === 'text' ? c.value : textOf(c))).join('');
const classOf = (node) => [].concat(node.properties?.className ?? node.properties?.class ?? []).join(' ');

/**
 * Markdown: a hast `raw` node (output byte-identical to katex.renderToString).
 * MDX: raw HTML can't become JSX, so parse KaTeX's HTML into real hast elements first.
 */
const html = (ctx, value) => {
  if (ctx.sourceFormat !== 'mdx') return { type: 'raw', value };
  const tree = htmlToHast(value);
  return (tree.children ?? []).filter((c) => !(c.type === 'text' && !c.value.trim()));
};

export const katexPlugin = defineHastPlugin({
  name: 'katex',
  element: {
    filter: ['code', 'pre'],
    visit(node, ctx) {
      if (node.tagName === 'code' && /\bmath-inline\b/.test(classOf(node))) {
        ctx.replaceNode(node, html(ctx, katex.renderToString(textOf(node), OPTIONS)));
        return;
      }
      if (node.tagName === 'pre') {
        const code = (node.children ?? []).find((c) => c.tagName === 'code');
        if (code && /\bmath-display\b/.test(classOf(code))) {
          const rendered = katex.renderToString(textOf(code), { ...OPTIONS, displayMode: true });
          ctx.replaceNode(node, html(ctx, `<div class="math-display">${rendered}</div>`));
        }
      }
    },
  },
});
