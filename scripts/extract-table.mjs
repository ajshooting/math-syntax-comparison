// scripts/extract-table.mjs
import fs from 'fs/promises';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remark2rehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

// --- 
const README_PATH = path.resolve('./README.md');
const OUTPUT_COMPONENT_PATH = path.resolve('./src/components/GeneratedTable.astro');
const TARGET_HEADING = 'table';
// ---

async function extractAndSaveTable() {
    console.log(`Reading README.md from: ${README_PATH}`);
    let readmeContent;
    try {
        readmeContent = await fs.readFile(README_PATH, 'utf-8');
    } catch (err) {
        console.error(`Error reading README.md: ${err.message}`);
        // READMEが見つからない場合は空のファイルを作成してビルドエラーを防ぐ
        console.log(`Creating empty component at ${OUTPUT_COMPONENT_PATH}`);
        const emptyContent = `---\nconst tableHtml = \`<p>Table not found</p>\`;\n---\n<div set:html={tableHtml} />`;
        await fs.mkdir(path.dirname(OUTPUT_COMPONENT_PATH), { recursive: true });
        await fs.writeFile(OUTPUT_COMPONENT_PATH, emptyContent, 'utf-8');
        return;
    }

    // parse README into MDAST with GFM tables and math nodes
    const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
    // parse then run to apply remark-gfm (table parsing)
    const parsed = processor.parse(readmeContent);
    const tree = await processor.run(parsed);

    let tableNode = null;
    let foundHeading = false;

    visit(tree, (node) => {
        if (tableNode) return;

        if (node.type === 'heading') {
            // 見出しノードをチェック
            const headingText = node.children.map(child => child.value).join('');
            if (headingText.trim() === TARGET_HEADING) {
                foundHeading = true;
                console.log(`Found heading: "${TARGET_HEADING}"`);
            } else {
                foundHeading = false;
            }
        } else if (foundHeading && node.type === 'table') {

            tableNode = node;
            console.log('Found target table node.');
        }
    });

    if (tableNode) {
        // 直接 MDAST を HAST に変換 (remark-gfm と remark-math により生成された tableNode)
        const root = { type: 'root', children: [tableNode] };
        const hast = await unified()
            .use(remark2rehype)
            .use(rehypeKatex, { displayMode: true })
            .run(root);
        // HAST を HTML にシリアライズ
        const html = unified()
            .use(rehypeStringify)
            .stringify(hast);
        console.log('Generated HTML:\n', html);

        // Astroコンポーネントとして出力
        console.log(`Writing generated component to: ${OUTPUT_COMPONENT_PATH}`);
        // Astroコンポーネントの内容を定義
        const componentContent = `---\nconst tableHtml = \`${html}\`;\n---\n<div set:html={tableHtml} />`;
        await fs.mkdir(path.dirname(OUTPUT_COMPONENT_PATH), { recursive: true });
        await fs.writeFile(OUTPUT_COMPONENT_PATH, componentContent, 'utf-8');
        console.log('Component generation successful.');
    } else {
        console.warn(`Warning: Could not find a table after heading "${TARGET_HEADING}" in ${README_PATH}.`);
        // 見つからない場合は空のコンポーネントを作成
        const emptyContent = `---\nconst tableHtml = \`<p>Table not found</p>\`;\n---\n<div set:html={tableHtml} />`;
        console.log(`Creating empty component at ${OUTPUT_COMPONENT_PATH}`);
        await fs.mkdir(path.dirname(OUTPUT_COMPONENT_PATH), { recursive: true });
        await fs.writeFile(OUTPUT_COMPONENT_PATH, emptyContent, 'utf-8');
    }
}

extractAndSaveTable().catch(err => {
    console.error('Error during table extraction:', err);
    process.exit(1);
});