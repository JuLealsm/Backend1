import fs from 'fs';

export function readData(file) {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
}

export function writeData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
