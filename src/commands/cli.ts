import chalk from 'chalk';
import { autoBox } from '../utils/box';
import { getOpenai } from '../utils/openai';
import { CANCEL, COPY_TO_CLIPBOARD, RUN_COMMAND } from '../constants/cli';
import ora from 'ora';
import { copy } from '../utils/clipboard';
import { exec } from '../utils/exec';
import { config } from '../utils/config';
import inquirer from 'inquirer';
import { CONFIG_KEYS } from "../constants/config";

export const cli = async (prompt: string) => {
    const openai = getOpenai();

    if (!openai) return;

    const spinner = ora('Generating...').start();

    try {
        const response = (
            await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a CLI command generator' },
                    {
                        role: 'user',
                        content: `Imagine you are ${
                            config.get('system') ?? 'macos'
                        } terminal commands selector. I will describe task and you will respond only using linux command, without description, without explanation, without quotation.: """${prompt}"""`,
                    },
                ],
                temperature: 0,
                max_tokens: config.get(CONFIG_KEYS.maxToken) ?? 100,
                top_p: 1.0,
                frequency_penalty: 0.2,
                presence_penalty: 0.0,
            })
        ).data.choices[0]?.message?.content?.trim();

        spinner.stop();

        if (response) {
            autoBox(chalk.yellow.bold(response));
            console.log();

            const { action } = await inquirer.prompt({
                name: 'action',
                message: 'Actions',
                choices: [RUN_COMMAND, COPY_TO_CLIPBOARD, CANCEL],
                type: 'list',
            });

            switch (action) {
                case RUN_COMMAND:
                    exec(response);
                    break;
                case COPY_TO_CLIPBOARD:
                    copy(response);
                    break;
            }
        } else {
            autoBox(chalk.red('No command'));
        }
    } catch (e) {
        spinner.stop();
        console.error(e);
        autoBox(chalk.red('An error occured.'));
    }
};
