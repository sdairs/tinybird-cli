import type { Config, Node, Schema, RenderableTreeNode } from '@markdoc/markdoc';
export declare const tags: {
    query: {
        render: string;
        attributes: {
            name: {
                type: StringConstructor;
                required: boolean;
            };
        };
        transform(node: Node, config: Config): import("@markdoc/markdoc").Tag<"pre", Record<string, any>>;
    };
    datasource: {
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
        transform(node: Node, config: Config): import("@markdoc/markdoc").Tag<"div", {
            class: string;
        }>;
    };
};
export interface TinybirdParserOptions {
    tags?: Record<string, Schema>;
    config?: Partial<Config>;
}
export declare class TinybirdParser {
    private config;
    constructor(options?: TinybirdParserOptions);
    parse(content: string): Node;
    transform(ast: Node): RenderableTreeNode;
    renderHtml(content: string): string;
    parseFile(content: string): {
        frontmatter: any;
        content: RenderableTreeNode;
    };
}
declare const _default: TinybirdParser;
export default _default;
