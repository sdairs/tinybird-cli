import { Config, Node, Schema } from '@markdoc/markdoc';
import { queryNode, tableNode } from './nodes';
export interface TinybirdParserOptions {
    /**
     * Additional Markdoc nodes to include in the parser
     */
    nodes?: Record<string, Schema>;
    /**
     * Additional Markdoc configuration
     */
    config?: Partial<Config>;
}
export declare class TinybirdParser {
    private config;
    constructor(options?: TinybirdParserOptions);
    /**
     * Parse a Tinybird file and return the AST
     */
    parse(content: string): Node;
    /**
     * Transform a parsed AST into a renderable tree
     */
    transform(ast: Node): import("@markdoc/markdoc").RenderableTreeNode;
    /**
     * Render the transformed tree to HTML
     */
    renderHtml(content: string): string;
    /**
     * Get the frontmatter from a Tinybird file
     */
    getFrontmatter(content: string): any;
    /**
     * Parse a Tinybird file and return both frontmatter and content
     */
    parseFile(content: string): {
        frontmatter: any;
        content: import("@markdoc/markdoc").RenderableTreeNode;
    };
}
export { queryNode, tableNode };
declare const _default: TinybirdParser;
export default _default;
