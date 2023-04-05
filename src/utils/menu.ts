import chalk from 'chalk';
import cliSelect from 'cli-select';
import { autoBox } from './box';

export const OpenMenu = <T extends string>(items: T[], callback: (item: T) => void) => {
    cliSelect(
        {
            values: items,
            valueRenderer: (value, selected) => {
                return selected ? chalk.bold(value) : value;
            },
            selected: chalk.green('    ◉'),
            unselected: '    ◯',
        },
        (index) => {
            const choice = (index as unknown as { id: number; value: string }).value as T;

            if (items.includes(choice)) {
                callback(choice);
            } else {
                autoBox(chalk.red('Invalid choice'));
            }
        },
    );
};
