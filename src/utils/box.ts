import Box from 'cli-box';
import { MIN_SIZE } from '../constants/box';

export const autoBox = (text: string) => {
    const width = Math.max(
        MIN_SIZE,
        Math.min(process.stdout.columns, Math.max(...text.split('\n').map((l) => l.length))),
    );
    const height = text.split(/\r\n|\r|\n/).length;

    console.log(
        Box(
            {
                height,
                width,
                marks: {
                    nw: '╭',
                    n: '─',
                    ne: '╮',
                    e: '│',
                    se: '╯',
                    s: '─',
                    sw: '╰',
                    w: '│',
                },
            },
            text,
        ),
    );
};
