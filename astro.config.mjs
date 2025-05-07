// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';




// https://astro.build/config
export default defineConfig({
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
