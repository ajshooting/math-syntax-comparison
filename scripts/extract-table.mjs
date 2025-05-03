// scripts/extract-table.mjs
import fs from 'fs/promises';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { remark } from 'remark';
import remarkStringify from 'remark-stringify'; 

// --- 
const README_PATH = path.resolve('./README.md');
const OUTPUT_MD_PATH = path.resolve('./src/components/GeneratedTable.md');
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
        console.log(`Creating empty file at ${OUTPUT_MD_PATH}`);
        await fs.mkdir(path.dirname(OUTPUT_MD_PATH), { recursive: true });
        await fs.writeFile(OUTPUT_MD_PATH, '', 'utf-8');
        return;
    }

    const processor = unified().use(remarkParse).use(remarkGfm);
    const tree = processor.parse(readmeContent);

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
        // テーブルノードをMarkdown文字列に変換
        // remark-stringify を使って、見つかったテーブルノードだけを含む新しいASTを文字列化する
        const tableMarkdown = remark()
            .use(remarkGfm) // GFMサポート（特にテーブル用）
            .use(remarkStringify, { listItemIndent: 'one' }) // テーブルの整形のため
            .stringify({ type: 'root', children: [tableNode] }); // テーブルノードだけを持つルートノードを作成

        console.log(`Writing extracted table to: ${OUTPUT_MD_PATH}`);
        await fs.mkdir(path.dirname(OUTPUT_MD_PATH), { recursive: true });
        await fs.writeFile(OUTPUT_MD_PATH, tableMarkdown, 'utf-8');
        console.log('Table extraction successful.');
    } else {
        console.warn(`Warning: Could not find a table after heading "${TARGET_HEADING}" in ${README_PATH}.`);
        // テーブルが見つからない場合も空ファイルを作成
        console.log(`Creating empty file at ${OUTPUT_MD_PATH}`);
        await fs.mkdir(path.dirname(OUTPUT_MD_PATH), { recursive: true });
        await fs.writeFile(OUTPUT_MD_PATH, '*(Table not found in README.md)*', 'utf-8');
    }
}

extractAndSaveTable().catch(err => {
    console.error('Error during table extraction:', err);
    process.exit(1);
});