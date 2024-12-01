# Tinybird file format proposal

1. Based on Markdoc
2. Every file ends with `.tinybird` to have one file extension
3. Folder structure and file names are optional, files are self descriptive
4. Files are both config AND docs at the same time

## Why Markdoc?
[https://markdoc.dev/](https://markdoc.dev/)

- Markdoc is written in TypeScript. It can run on a user's machine, it could be invoked without installation using npx, it could even run in the browser inside the UI.
- It is extensible. We can add our own tags, etc.
- It is familiar. It's Markdown with some extra bits.
- Parsing it is easy. 
- The file itself can be rendered as documentation.
- Formatting - its just Markdown, so we can use any Markdown formatter with only minor customisation to know how to format our custom tags.
- AI and LLMs know Markdown/Markdoc/YAML very well.

## Why use one file extensions?
- Tinybird is unlikely to clash with any other file extension
- It reinforces our brand name
- You know immediately it is a Tinybird file