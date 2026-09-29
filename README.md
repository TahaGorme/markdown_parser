# markdown_parser

A tiny markdown parser written from scratch in Rust, compiled to WebAssembly and run in the browser.

## What it does

Parses a small subset of markdown into HTML: `#` headings, `-` lists, `**bold**`, and plain paragraphs. The parser is hand-written in Rust with no parsing libraries, just a position over the input and a few consume helpers.

It compiles to WebAssembly with wasm-bindgen and exports a single `parse(input)` function back to JavaScript. `index.js` renders the result into the page as you type.

## How it works

The parser is one struct holding the whole input and a position into it. `parse_lines` loops: skip whitespace, stop at the end, otherwise dispatch on the first character of the line.

- `#` calls `parse_title`, which counts the leading hashes for the level (clamped to `h6`) and reads the rest as text.
- `-` calls `parse_list`, which keeps collecting `-` lines into a single `<ul>`.
- anything else is a paragraph, read with `parse_text`. Inside a paragraph, a `**...**` run is handed to `parse_bold` and wrapped in `<strong>`.

Text is consumed by `consume_while`, which appends characters while a condition holds. `consume_char` advances the position by the width of one UTF-8 character, so multi-byte input does not split. Each piece is wrapped in a tag by `create_html_element`.

## What I learned

- Writing a parser from scratch: tracking a position, peeking at the next char, and consuming characters, whitespace, and runs of text.
- Why the crate has to be `cdylib`, since that is what produces the `.wasm` the browser loads.
- What wasm-bindgen emits for the `bundler` target, and how `markdown_parser.js`, `markdown_parser_bg.js`, and `markdown_parser_bg.wasm` fit together.
- Gluing the whole thing into a page with webpack 5 and its built-in `asyncWebAssembly` support.

## Running it

```sh
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen --target bundler --out-dir pkg target/wasm32-unknown-unknown/release/markdown_parser.wasm

npm install
npm run build
```

There are also scripts for this:

```sh
npm run build:wasm
npm start
```

Type markdown into the box and the HTML updates live.

I built this to learn how a parser works and how wasm-bindgen ties Rust to the web.
