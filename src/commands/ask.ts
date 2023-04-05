import chalk from 'chalk';
import { autoBox } from '../utils/box';
import { getOpenai } from '../utils/openai';
import ora from 'ora';

export const ask = async (prompt: string) => {
    const openai = getOpenai();

    if (!openai) return;

    const spinner = ora('Generating...').start();

    try {
        const response = (
            await openai.createCompletion({
                model: 'text-davinci-003',
                max_tokens: 100,
                prompt,
            })
        ).data.choices[0]?.text?.trim();

        spinner.stop();

        if (response) {
            console.log(chalk.bold('Prompt:') + ' ' + prompt);
            console.log(chalk.bold.green('Response:') + ' ' + response);
        } else {
            autoBox(chalk.red('No response'));
        }
    } catch (e) {
        spinner.stop();
        console.error(e);
        autoBox(chalk.red('An error occured.'));
    }
};
