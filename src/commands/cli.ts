import chalk from 'chalk';
import { autoBox } from '../utils/box';
import { getOpenai } from '../utils/openai';
import { CANCEL, COPY_TO_CLIPBOARD, PRECISE_COMMAND, RUN_COMMAND } from '../constants/cli';
import ora from 'ora';
import { copy } from '../utils/clipboard';
import { exec } from '../utils/exec';
import { config } from '../utils/config';
import inquirer from 'inquirer';
import { ChatCompletionRequestMessage } from 'openai';

export const cli = async (prompt: string) => {
    const openai = getOpenai();

    if (!openai) return;

    const messages: ChatCompletionRequestMessage[] = [
        { role: 'system', content: 'You are a CLI command generator' },
        {
            role: 'user',
            content: `Imagine you are ${
                config.get('system') ?? 'macos'
            } terminal commands selector. I will describe task and you will respond only using linux command, without description, without explanation, without quotation.: """${prompt}"""`,
        },
    ];

    const spinner = ora('Generating...').start();

    try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const response = (
                await openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages,
                    temperature: 0,
                    max_tokens: config.get('max-token') ?? 100,
                    top_p: 1.0,
                    frequency_penalty: 0.2,
                    presence_penalty: 0.0,
                })
            ).data.choices[0]?.message?.content?.trim();

            spinner.stop();

            if (response) {
                autoBox(chalk.yellow.bold(response));

                const { action } = await inquirer.prompt({
                    name: 'action',
                    message: 'Actions',
                    choices: [RUN_COMMAND, COPY_TO_CLIPBOARD, PRECISE_COMMAND, CANCEL],
                    type: 'list',
                });

                switch (action) {
                    case RUN_COMMAND:
                        exec(response);
                        return;
                    case COPY_TO_CLIPBOARD:
                        copy(response);
                        return;
                    case PRECISE_COMMAND: {
                        const { content } = await inquirer.prompt([
                            {
                                name: 'content',
                                message: 'precision',
                            },
                        ]);

                        messages.push({
                            role: 'user',
                            content: `I will describe a modification for the previous command and you will respond only using linux command, without description, without explanation, without quotation: """${content}"""`,
                        });

                        break;
                    }
                    case CANCEL:
                        return;
                }
            } else {
                autoBox(chalk.red('No command'));
            }
        }
    } catch (e) {
        spinner.stop();
        console.error(e);
        autoBox(chalk.red('An error occured.'));
    }
};
