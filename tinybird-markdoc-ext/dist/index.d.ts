import type { Config, Node, Schema } from '@markdoc/markdoc';
export declare const queryNode: {
    render: string;
    attributes: {
        name: {
            type: StringConstructor;
            required: boolean;
        };
    };
    transform(node: any, config: Config): any;
};
export declare const tableNode: {
    render: string;
    attributes: {
        name: {
            type: StringConstructor;
            required: boolean;
        };
        delimiter: {
            type: StringConstructor;
            default: string;
        };
    };
    transform(node: any, config: Config): any;
};
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
     * Parse a Tinybird file and return both frontmatter and content
     */
    parseFile(content: string): {
        frontmatter: any;
        content: string;
    };
}
declare const _default: TinybirdParser;
export default _default;
