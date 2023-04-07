import Box from 'cli-box';
import { MIN_SIZE } from '../constants/box';

interface AutoBoxOptions {
    textAlign?: 'left' | 'middle' | 'right';
}

const TRIM_ESC = 'ð';

export const autoBox = (text: string, { textAlign = 'middle' }: AutoBoxOptions = {}) => {
    const width = Math.max(
        MIN_SIZE,
        Math.min(process.stdout.columns, Math.max(...text.split('\n').map((l) => l.length))),
    );
    const height = text.split(/\r\n|\r|\n/).length;

    let box = Box(
        {
            stringify: true,
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
        {
            text: text.split('\xa0').join(TRIM_ESC),
            hAlign: textAlign,
            autoEOL: true,
            stretch: true,
        },
    );

    box = box.split(TRIM_ESC).join(' ');

    console.log(box);
};
