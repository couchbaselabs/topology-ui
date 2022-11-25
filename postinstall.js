// This script runs automatically after "npm install"

// const fs = require('fs-extra');
import * as fs from 'fs-extra'
// const path = require('path');
import * as path from 'path'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const src = __dirname + '/assets';
const dest = '../../assets';

console.log(__dirname);

fs.move(src, dest)
.then(() => {
  console.log('The folder images has been moved successful');
})
.catch(err => {
  console.error(err);
})