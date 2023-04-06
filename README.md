# cli-ai

This CLI app utilizes chatgpt to interpret natural language queries, enabling users to converse, ask questions and generate CLI commands easily and efficiently.

## Usage

### Ask AI

This mode allows you to ask a question.

![Ask AI](./assets/example1.png)

### Generate CLI command

The feature to simply ask a question allows users to type or speak a question in natural language, and the CLI app will use the chatgpt language model to interpret the query and generate a CLI command.

For example, a user can ask "How do I create a new file?" and the CLI app will generate the appropriate command to create a new file, such as "touch filename".

You can then run it or copy it to your clipboard.

![Generate CLI command](./assets/example2.png)

### Conversational

Start a chat conversation with ChatGPT.

![Conversational](./assets/example3.png)

## Installation

### Manual

1. Clone this repo
2. Install dependencies `npm ci`
3. Build the project `npm run build`
4. Package the project
    - This app has only been tested on a M2 Mac and the command only exists for this architecture. `npm run package:macos`
    - If you don't have a Mac, you might need to checkout the [pkg](https://www.npmjs.com/package/pkg) documentation.
5. Add `./bin` to you path.
    - With `zsh` from this directory: `echo "\n# cli-ai\nexport PATH=\"\$PATH:$PWD/bin\"" >> ~/.zshrc`
    - With `bash` from this directory: `echo "\n# cli-ai\nexport PATH=\"\$PATH:$PWD/bin\"" >> ~/.bashrc`
6. Add your OpenAI API key with `ai config set api-key <my api key>`
