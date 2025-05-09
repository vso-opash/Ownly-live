import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import {join} from 'path';


import * as domino from 'domino';
import * as  fs from 'fs';
import 'localstorage-polyfill'

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();


// Use the browser index.html as template for the mock window
//const distFolder = join(process.cwd(), 'dist','YourProjectName',  'browser');
const template = fs.readFileSync(join(process.cwd(),'dist',  'browser', 'index.html')).toString();

// Shim for the global window and document objects.
const window = domino.createWindow(template);
global['window'] = window;
Object.defineProperty(window.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  },
});

global['document'] = window.document;
global['CSS'] = null;
global['navigator'] = window.navigator;
global['localStorage'] = localStorage;




// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
 // res.render('index', { req });
  res.render(join(DIST_FOLDER, 'index.html'), { req,res });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
