#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { ask } from './commands/ask';
import { cli } from './commands/cli';
import { CONFIG_KEYS } from './constants/config';
import { del, get, set } from './commands/config';
import { converse } from './commands/converse';
import { sql } from './commands/sql';

yargs(hideBin(process.argv))
    .command({
        command: 'ask [prompt]',
        describe: 'Ask AI',
        aliases: ['a'],
        handler: async (argv) => {
            if (argv.prompt) {
                await ask(argv.prompt + ' ' + argv._.slice(1).join(' '));
            } else {
                await converse();
            }
        },
    })
    .command({
        command: 'cli <prompt>',
        describe: 'Generate a CLI command',
        aliases: ['c'],
        handler: async (argv) => {
            await cli(argv.prompt + ' ' + argv._.slice(1).join(' '));
        },
    })
    .command({
        command: 'sql <prompt>',
        describe: 'Generate a SQL query',
        aliases: ['s'],
        handler: async (argv) => {
            await sql(argv.prompt + ' ' + argv._.slice(1).join(' '));
        },
    })
    .command({
        command: 'config',
        describe: 'Change app configurations',
        builder: (yargs) =>
            yargs
                .command(
                    'set <key> <value>',
                    'Set value',
                    (yargs) =>
                        yargs
                            .positional('key', {
                                choices: Object.values(CONFIG_KEYS),
                            })
                            .positional('value', {
                                type: 'string',
                            })
                            .demandOption(['key', 'value']),
                    (argv) => {
                        set(argv.key, argv.value);
                    },
                )
                .command(
                    'get <key>',
                    'Get value',
                    (yargs) =>
                        yargs
                            .positional('key', {
                                choices: Object.values(CONFIG_KEYS),
                            })
                            .demandOption('key'),
                    (argv) => {
                        get(argv.key);
                    },
                )
                .command(
                    'del <key>',
                    'Delete value',
                    (yargs) =>
                        yargs
                            .positional('key', {
                                choices: Object.values(CONFIG_KEYS),
                            })
                            .demandOption('key'),
                    (argv) => {
                        del(argv.key);
                    },
                )
                .demandCommand(),
        handler: (argv) => {
            cli(argv.prompt + ' ' + argv._.slice(1).join(' '));
        },
    })
    .usage('CLI AI\n\nUse OpenAI AI directly in the terminal')
    .demandCommand(1)
    .parse();
