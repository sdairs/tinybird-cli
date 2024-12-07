import Markdoc from '@markdoc/markdoc';
import { parse as parseYaml } from 'yaml';
// Import nodes from CommonJS module
const { nodes: markdocNodes } = Markdoc;
// Tag definitions
export const tags = {
    query: {
        render: 'pre',
        attributes: {
            name: { type: String, required: true }
        },
        transform(node, config) {
            const attributes = node.transformAttributes(config);
            const children = node.transformChildren(config);
            // const sqlContent = children.join('\n')
            return new Markdoc.Tag('pre', attributes, [
                new Markdoc.Tag('code', { class: 'language-sql' }, children)
            ]);
        }
    },
    datasource: {
        render: 'div',
        attributes: {
            name: { type: String, required: true },
            delimiter: { type: String, default: '|' }
        },
        transform(node, config) {
            const attributes = node.transformAttributes(config);
            const children = node.transformChildren(config);
            let columns = [];
            children.forEach((child) => {
                if (child && typeof child === 'object' && 'children' in child && Array.isArray(child.children)) {
                    // Process each text entry in the Tag's children array
                    child.children.forEach((text) => {
                        if (typeof text === 'string') {
                            const trimmedText = text.trim();
                            if (trimmedText) { // Skip empty or whitespace-only strings
                                const [name, type, path, description] = trimmedText
                                    .split(attributes.delimiter)
                                    .map(s => s.trim());
                                if (name && type && path) { // Ensure we have the required fields
                                    columns.push({ name, type, path, description });
                                }
                            }
                        }
                    });
                }
            });
            // Create table structure
            const tableHeader = new Markdoc.Tag('thead', {}, [
                new Markdoc.Tag('tr', {}, [
                    new Markdoc.Tag('th', {}, ['Name']),
                    new Markdoc.Tag('th', {}, ['Type']),
                    new Markdoc.Tag('th', {}, ['Path']),
                    new Markdoc.Tag('th', {}, ['Description'])
                ])
            ]);
            const tableBody = new Markdoc.Tag('tbody', {}, columns.map(col => new Markdoc.Tag('tr', {}, [
                new Markdoc.Tag('td', {}, [col.name]),
                new Markdoc.Tag('td', {}, [col.type]),
                new Markdoc.Tag('td', {}, [col.path]),
                new Markdoc.Tag('td', {}, [col.description])
            ])));
            const table = new Markdoc.Tag('table', { class: 'datasource-table' }, [
                tableHeader,
                tableBody
            ]);
            return new Markdoc.Tag('div', { class: 'datasource-container', ...attributes }, [table]);
        }
    }
};
export class TinybirdParser {
    config;
    constructor(options = {}) {
        this.config = {
            ...options.config,
            tags: {
                ...tags,
                ...options.tags
            }
        };
    }
    // Parse a Tinybird file and return the AST
    parse(content) {
        return Markdoc.parse(content);
    }
    // Transform a parsed AST into a renderable tree
    transform(ast) {
        return Markdoc.transform(ast, this.config);
    }
    // Render the transformed tree to HTML
    renderHtml(content) {
        const ast = this.parse(content);
        const tree = this.transform(ast);
        return Markdoc.renderers.html(tree);
    }
    // Parse a Tinybird file and return both frontmatter and content
    parseFile(content) {
        const ast = this.parse(content);
        const frontmatter = ast.attributes.frontmatter
            ? parseYaml(ast.attributes.frontmatter)
            : {};
        const tree = this.transform(ast);
        return {
            frontmatter,
            content: tree
        };
    }
}
// Export default instance with standard configuration
export default new TinybirdParser();
