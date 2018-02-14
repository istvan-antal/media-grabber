import { create } from './compiler';
import './install';

create().run((err: any, stats: any) => {
    if (err) {
        throw err;
    }
    console.log(stats);
});