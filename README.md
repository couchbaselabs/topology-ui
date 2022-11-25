# How to use the library

* npm init -y
* npm install copy-webpack-plugin webpack webpack-cli copy-webpack-plugin webpack-dev-server --save-dev
* npm install topology-ui
* create webpack.config.js file with next configuration:
```javascript
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
  mode: 'development',
  plugins: [
    new CopyPlugin({
      patterns: [
          {from:'./assets',to:'assets'},
          {from:'./src/index.html',to:'./'}
      ],
    }),
  ],
};
```
* create src folder
* create index.html file inside of src:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Couchbase Info CSS</title>
    <!-- font-awesome v5.15.4 -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet"/>
    <!-- tailwind v3.0.23 -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- jsoneditor v9.7.3 -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.7.3/jsoneditor.min.css" rel="stylesheet" type="text/css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.7.3/jsoneditor.min.js"></script>
</head>
<body >
<!-- <body> --> 
    <div class="container">
        <main class="container-fluid">
            <div class="row justify-content-center">
                <div id="display" class="flex justify-content-center">
                </div>
            </div>
            <div class="row justify-content-center">
                <form>
                    <div id="jsoneditor" class="mx-5 w-90"></div>
                </form>
            </div>
        </main>
    </div>
    <script src="main.js"></script>
</body>
</html>
```
* create index.js file inside of src:
```javascript
const topologyLib = require('topology-ui/lib/index.js')
import { data } from './mockData.js';

export function create_cluster(content, data) {
    content.innerHTML = "<div class=\"flex flex-col justify-content-center\">" +
        "<div class=\"flex flex-row justify-content-center items-center \">" +
        topologyLib.create_mobile(data.mobile) +
        topologyLib.create_apps(data.applications) +
        "</div>" +
        "<div class=\"flex flex-row auto-rows-auto\">" +
        "  <div class=\"flex-col align-center grow \">" +
        topologyLib.create_server_topology(data) +
        "  </div>" +
        "  <div class=\"flex flex-col flex-nowrap  shrink-0 \">" +
        "  <div class=\"flex flex-row flex-nowrap  \">" +
        topologyLib.create_buckets(data.buckets) +
        "      </div>" +
        "  </div>" +
        "</div>" +
        "</div>";
}

let content = document.getElementById("display");
create_cluster(content, data);

// create the editor
let content5 = document.getElementById("display");
const container = document.getElementById("jsoneditor")
const options = { mode: 'tree', name: "Cluster Topology",
    onEvent: function(node, event) {
        data = editor.get()
        create_cluster(content5, data)
    }
}
const editor = new JSONEditor(container, options);

editor.set(data);
```
* use mockData.js
* npm run buld
* add "build": "webpack" in the package.json in scripts section
* npx webpack serve