var util = require('./util');
var proto = require('./proto');
var path = require('path');


var template = require('../tmpl/clazz');

// parse args from command-line
var args = util.parseArgs();

if (!args.target && !args.entry) {
    throw new Error('parameter target or entry must be provided!');
}
if(args.target) {
    parseEntry(args.target);
}

if(args.entry) {
    for(var i in args.entry) {
        parseEntry(args.entry[i]);
    }
}
function parseEntry(entry) {
    console.log(`loading configuration from ${entry}`);
    proto.parse(entry).then(function(data){
        var parsedData = proto.parseClazz(data);

        for(var i in parsedData.clazzList) {
            var clazzData = Object.assign(parsedData.clazzList[i],args);
            var renderedText = proto.render(template, clazzData);
            util.outputFile(args.outputPath,`${clazzData.clazzName}.js`,renderedText);
        }
        
    },function(err) {
        console.log(err)
    });
}