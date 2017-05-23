var https = require('https');
var http = require('http');
var fs = require('fs');
var Q = require('q');
var mustache = require('mustache');

module.exports = {
    // fetch and parse proto defination from specified url
    parse: function(url) {
        // fix https signature problems
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
        var dfd = Q.defer();
        // determin use https / http / fs
        if (url.indexOf('https') === 0) {
            https.get(url, function(res) {
                var html = '';
                res.on('data', function(data) {
                    html += data;
                })
                res.on('end', function() {
                    dfd.resolve(JSON.parse(html));
                })
            }).on('error', function(err) {
                dfd.reject(err);
            })
        } else if(url.indexOf('http') === 0){
            http.get(url, function(res) {
                var html = '';
                res.on('data', function(data) {
                    html += data;
                })
                res.on('end', function() {
                    dfd.resolve(JSON.parse(html));
                })
            }).on('error', function(err) {
                dfd.reject(err);
            })
        } else {
            fs.readFile(url, {encoding:'utf-8'}, function(err, bytesRead) {
                if (err) {
                    dfd.reject(err);
                }
                dfd.resolve(JSON.parse(bytesRead + ""));
            })
        }
        
        return dfd.promise;
    },
    render:function(template, data) {
        return mustache.to_html(template, data);
    },
    parseClazz:function(data){
        var parsedData = {clazzList:[]};
        var clazzMap = {};
        for(var path in data.paths) {
            for(var operation in data.paths[path]){
                var tags = data.paths[path][operation].tags;
                for(var tag in tags){
                    if(!clazzMap[tags[tag]]){
                        clazzMap[tags[tag]] = {clazzName:tags[tag],methods: []};
                        parsedData.clazzList.push(clazzMap[tags[tag]]);
                    }
                    data.paths[path][operation].method = (operation || '').toUpperCase();
                    data.paths[path][operation].path = path.replace(/(\{)/g,'\${');
                    
                    clazzMap[tags[tag]].methods.push(data.paths[path][operation]);
                    clazzMap[tags[tag]].info = data.info;
                }
            }
        }
        for(var i in clazzMap) {
            clazzMap[i].methods.forEach((e) => {
                e.parameters.forEach((param) => {
                    param.paramType = (param.in === 'body' || param.in === 'query') ? 'object' : 'string';
                    param.name = param.name.replace(/_(\w)/ig,function(txt){return (txt || '').replace('_','').toUpperCase()})
                    param.description = param.description || param.name;
                })
                
                e.paramsText = e.parameters.filter((param) => {return param.in === 'path' || (param.in === param.name)}).map((param) => {return param.name}).join(', ');
                e.body = e.parameters.filter((param) => {return param.in === 'body' || param.in === 'query'});
                var params = undefined;
                if(e.body && e.body.length) {
                    params = e.body[0];
                    e.body = e.body[0].name;
                    if(e.method !== 'DELETE') {
                        e.body = `JSON.stringify(${e.body} || {})`;
                    }
                }
                if (e.method === 'GET' && params) {
                    if (!e.paramsText) {
                        e.paramsText = 'query';
                    }
                    e.path = `\`${e.path}?\$\{queryString.stringify(query)\}\``;
                    e.body = undefined;
                } else {
                    if(e.path.match(/\$\{/)) {
                        e.path = `\`${e.path}\``;
                    }else {
                        e.path = `'${e.path}'`;
                    }
                }
                
                e.path = e.path.replace(/_(\w)/ig,function(txt){return (txt || '').replace('_','').toUpperCase()});
                
                e.paramName = e.operationId.replace(/^\w/ig,function(txt){return txt.toLowerCase()})
            })
            
        }
        return parsedData;
    }
}