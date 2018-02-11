import { create } from './compiler';

create().run((err: any, stats: any) => {
    if (err) {
        throw err;
    }
    console.log(stats);
});