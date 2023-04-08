import chalk from 'chalk';
import { getOpenai } from '../utils/openai';
import { ChatCompletionRequestMessage } from 'openai';
import ora from 'ora';
import { config } from '../utils/config';
import inquirer from 'inquirer';

export const converse = async () => {
    const openai = getOpenai();

    if (!openai) return;

    const history: ChatCompletionRequestMessage[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { content } = await inquirer.prompt([
            {
                name: 'content',
                message: 'you',
            },
        ]);

        if (!content) return;

        history.push({ role: 'user', content });

        const spinner = ora('').start();

        const response = (
            await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are an helpful assistant' },
                    ...history.slice(-1 * Number(config.get('chat-history') ?? 3)),
                ],
                max_tokens: 100,
            })
        ).data.choices[0]?.message?.content.trim();

        spinner.stop();

        if (response) {
            history.push({ role: 'assistant', content: response });
            console.log('  ' + chalk.bold.green('bot') + ' ' + response);
        } else {
            console.log('  ' + chalk.bold.green('bot') + ' ' + chalk.italic('No response'));
        }
    }
};
