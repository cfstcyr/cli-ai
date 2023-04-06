import chalk from 'chalk';
import promptSync from 'prompt-sync';
import { getOpenai } from '../utils/openai';
import { ChatCompletionRequestMessage } from 'openai';
import ora from 'ora';
import { config } from '../utils/config';
import { CONFIG_KEYS } from '../constants/config';

export const converse = async () => {
    const prompt = promptSync({});
    const openai = getOpenai();

    if (!openai) return;

    const history: ChatCompletionRequestMessage[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const content = prompt(chalk.gray('(') + chalk.bold('you') + chalk.gray(')') + ' ');

        if (!content) return;

        history.push({ role: 'user', content });

        const spinner = ora('').start();

        const response = (
            await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are an helpful assistant' },
                    ...history.slice(-1 * Number(config.get(CONFIG_KEYS.chatHistory) ?? 3)),
                ],
                max_tokens: 100,
            })
        ).data.choices[0]?.message?.content.trim();

        spinner.stop();

        if (response) {
            history.push({ role: 'assistant', content: response });
            console.log(chalk.gray('(') + chalk.green('bot') + chalk.gray(')') + ' ' + response);
        } else {
            console.log(
                chalk.gray('(') +
                    chalk.green('bot') +
                    chalk.gray(')') +
                    ' ' +
                    chalk.italic('No response'),
            );
        }
    }
};
