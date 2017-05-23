var fs = require('fs');
var path = require('path');

module.exports = {
    parseArgs: function() {
        var defaultConfig = {
            outputPath: './output',
            author: 'yanwx@jingoal.com'
        };
        var processArgs = process.argv;
        var inputArgs = {};
        if (processArgs && processArgs.length) {
            for(var i in processArgs) {
                var matched = processArgs[i].match(/--(\w+)=(.+)/);
                if(matched && matched.length > 2) {
                    inputArgs[matched[1]] = matched[2];
                }
            }
        }
        var fileConfig = {};
        if (inputArgs.config) {
            fileConfig = this.readConfigFromFile(inputArgs.config);
        }
        return Object.assign(defaultConfig,inputArgs,fileConfig);
    },
    readConfigFromFile: function(configfile){
        if(!fs.existsSync(configfile)){
            console.warn(`file ${configfile} not exist!`);
            return {};
        }
        try {
            var configText = fs.readFileSync(configfile);
            return JSON.parse(configText);
        }catch(e) {
            console.log(e);
            return {};
        }
    },
    outputFile: function(folder,file, data) {
        if (!fs.existsSync(folder)) {
            try{
                fs.mkdirSync(folder);
            }catch(e) {
                console.log(e)
            }
            
        }
        fs.writeFile(path.resolve(folder,file),data,function(err){
            if(err) {
                console.log(err);
            }else {
                console.log(`file ${file} created!`)
            }
        });
    }
}