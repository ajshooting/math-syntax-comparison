// @ts-nocheck
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';


// https://astro.build/config
export default defineConfig({
    site: "https://ajshooting.github.io/math-syntax-comparison/",
    base: "/math-syntax-comparison/",
    integrations: [mdx()],
    markdown: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [[rehypeKatex, { displayMode: true }]],
        syntaxHighlight: 'shiki',
        shikiConfig: {
            theme: 'css-variables',
            wrap: true,
        },
    },
});
