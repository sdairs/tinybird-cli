import Markdoc from '@markdoc/markdoc';
import { parse as parseYaml } from 'yaml';
// Import nodes from CommonJS module
const { nodes: markdocNodes } = Markdoc;
// Node definitions
export const queryNode = {
    render: 'Query',
    attributes: {
        name: { type: String, required: true }
    },
    transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);
        // Extract SQL content
        const sqlContent = children.join('\n');
        return {
            ...node,
            attributes: {
                ...attributes,
                sql: sqlContent
            }
        };
    }
};
export const tableNode = {
    render: 'Table',
    attributes: {
        name: { type: String, required: true },
        delimiter: { type: String, default: '|' }
    },
    transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);
        // Parse schema content
        const schemaContent = children.join('\n');
        const columns = schemaContent
            .split('\n')
            .filter((line) => line.trim())
            .map((line) => {
            const [name, type, path, description] = line
                .split(attributes.delimiter)
                .map((s) => s.trim());
            return { name, type, path, description };
        });
        return {
            ...node,
            attributes: {
                ...attributes,
                columns
            }
        };
    }
};
export class TinybirdParser {
    config;
    constructor(options = {}) {
        this.config = {
            ...options.config,
            nodes: {
                ...markdocNodes,
                query: queryNode,
                table: tableNode,
                ...options.nodes
            }
        };
    }
    /**
     * Parse a Tinybird file and return the AST
     */
    parse(content) {
        const ast = Markdoc.parse(content);
        return ast;
    }
    /**
     * Transform a parsed AST into a renderable tree
     */
    transform(ast) {
        return Markdoc.transform(ast, this.config);
    }
    /**
     * Render the transformed tree to HTML
     */
    renderHtml(content) {
        const ast = this.parse(content);
        const tree = this.transform(ast);
        return Markdoc.renderers.html(tree);
    }
    /**
     * Parse a Tinybird file and return both frontmatter and content
     */
    parseFile(content) {
        const ast = this.parse(content);
        const frontmatter = parseYaml(ast.attributes.frontmatter);
        const tree = this.transform(ast);
        return {
            frontmatter: frontmatter || {},
            content: Markdoc.renderers.html(tree)
        };
    }
}
// Export default instance with standard configuration
export default new TinybirdParser();
