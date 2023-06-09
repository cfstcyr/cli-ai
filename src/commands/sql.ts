import { getOpenai } from '../utils/openai';
import ora from 'ora';
import { config } from '../utils/config';
import { autoBox } from '../utils/box';
import chalk from 'chalk';
import { CANCEL, COPY_TO_CLIPBOARD, PRECISE_COMMAND } from '../constants/cli';
import inquirer from 'inquirer';
import { copy } from '../utils/clipboard';
import { ChatCompletionRequestMessage } from 'openai';
import highlight from 'cli-highlight';
import { format } from 'sql-formatter';

export const sql = async (prompt: string) => {
    const openai = getOpenai();

    if (!openai) return;

    const messages: ChatCompletionRequestMessage[] = [
        { role: 'system', content: 'You are a SQL command generator' },
        {
            role: 'user',
            content: `You are a SQl generator. I will describe task and you will respond only using SQL query, without description, without explanation, without quotation: """${prompt}"""`,
        },
    ];

    const spinner = ora('Generating...');

    try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            spinner.start();

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
            ).data.choices[0]?.message?.content.trim();

            spinner.stop();

            if (response) {
                messages.push({ role: 'system', content: response });

                try {
                    autoBox(
                        '\xa0' +
                            highlight(format(response, { language: 'sql' }), { language: 'sql' })
                                .split(' ')
                                .join('\xa0')
                                .split('\n')
                                .join('\n\xa0'),
                        { textAlign: 'left' },
                    );
                } catch {
                    console.log(chalk.gray.italic('Unable to format SQL query'));
                    autoBox(chalk.yellow(response));
                }

                const { action } = await inquirer.prompt({
                    name: 'action',
                    message: 'Actions',
                    choices: [COPY_TO_CLIPBOARD, PRECISE_COMMAND, CANCEL],
                    type: 'list',
                });

                switch (action) {
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
                            content: `I will describe a modification for the previous query and you will respond only using SQL query, without description, without explanation, without quotation: """${content}"""`,
                        });

                        break;
                    }
                    case CANCEL:
                        return;
                }
            } else {
                autoBox(chalk.red('No response'));
                return;
            }
        }
    } catch (e) {
        spinner.stop();
        console.error(e);
        autoBox(chalk.red('An error occured.'));
        return;
    }
};
