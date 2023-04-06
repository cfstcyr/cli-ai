import chalk from 'chalk';
import { autoBox } from '../utils/box';
import { getOpenai } from '../utils/openai';
import ora from 'ora';
import { config } from '../utils/config';
import { CONFIG_KEYS } from '../constants/config';
import wrap from 'word-wrap';

export const ask = async (prompt: string) => {
    const openai = getOpenai();

    if (!openai) return;

    const spinner = ora('Generating...').start();

    try {
        const response = (
            await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are an helpful assistant' },
                    { role: 'user', content: prompt },
                ],
                max_tokens: config.get(CONFIG_KEYS.maxToken) ?? 100,
            })
        ).data.choices[0]?.message?.content.trim();

        spinner.stop();

        if (response) {
            console.log(wrap(response, { width: process.stdout.columns }));
        } else {
            autoBox(chalk.red('No response'));
        }
    } catch (e) {
        spinner.stop();
        console.error(e);
        autoBox(chalk.red('An error occured.'));
    }
};
