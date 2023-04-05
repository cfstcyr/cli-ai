import chalk from 'chalk';
import { autoBox } from '../utils/box';
import { getOpenai } from '../utils/openai';
import { CANCEL, COPY_TO_CLIPBOARD, RUN_COMMAND } from '../constants/cli';
import ora from 'ora';
import { OpenMenu } from '../utils/menu';
import { copy } from '../utils/clipboard';
import { exec } from '../utils/exec';

export const cli = async (prompt: string) => {
    const openai = getOpenai();

    if (!openai) return;

    const spinner = ora('Generating...').start();

    try {
        const response = (
            await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: `Convert this text to a CLI command: 
                Desired format: command only            
                prompt: """${prompt}"""`,
                temperature: 0,
                max_tokens: 100,
                top_p: 1.0,
                frequency_penalty: 0.2,
                presence_penalty: 0.0,
            })
        ).data.choices[0]?.text?.trim();

        spinner.stop();

        if (response) {
            console.log(chalk.bold('Prompt:') + ' ' + prompt + '\n');
            autoBox(chalk.yellow.bold(response));
            console.log();

            OpenMenu([RUN_COMMAND, COPY_TO_CLIPBOARD, CANCEL], (item) => {
                switch (item) {
                    case RUN_COMMAND:
                        console.log(chalk.green('Executing command...') + '\n');
                        exec(response);
                        break;
                    case COPY_TO_CLIPBOARD:
                        copy(response);
                        break;
                }
            });
        } else {
            autoBox(chalk.red('No command'));
        }
    } catch (e) {
        spinner.stop();
        console.error(e);
        autoBox(chalk.red('An error occured.'));
    }
};
