# Jingoal Swagger Client-Side Code Generator

A tool helps to generate client-side code to access the swagger restful API.
The current version doesn't support custom template, but i will make it work later :-D.

## Options:

* target : you can directly generate client-side service code from a swagger description file.
* config: specify a configuration file where you can add multi swagger description entry, see below.
* outputPath: this option tells tool how to write the compiled files to disk.

## Configuration

you can specify the  configuration file like below: 
```json
{
    "entry": [
        "https://web.test.com/swagger/json/itemdata/task.swagger.json",
        "https://web.test.com/swagger/json/itemdata/worklog.swagger.json"
    ],
    "outputPath": "./service"
}
```
The entry parameter now support http/https and directly read from file.

## Usage

First, install this tool globally:

```bash
npm install -g swagger-es6-client-generator
```

You can use the `target` parameter in the command line:
```bash
swagger-es6-cli --target=./usersetting.swagger.json --outputPath=./service
```
or you can do this by specify the `config` to work with multi entry:

```bash
swagger-es6-cli --config=./swagger.conf.json
```
## Changelog
* v1.0.3 Change the generated file extension from `jsx` to `js`
* v1.0.5 Adapt to some fucking unstandard swagger definations...