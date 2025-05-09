// @ts-nocheck
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

// GitHub Pages サイト URL と base パスを環境変数から設定（process.env を直接利用）
const repo = process.env.GITHUB_REPOSITORY || '';
const [owner, name] = repo.split('/') || [];
const siteUrl = owner && name ? `https://${owner}.github.io/${name}` : undefined;
const basePath = name ? `/${name}/` : '/';

// https://astro.build/config
export default defineConfig({
    site: siteUrl,
    base: basePath,
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
