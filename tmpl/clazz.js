module.exports = 
`/**
 * @file {{clazzName}}.jsx
 * @author {{author}}
 * @version {{info.version}}
 * {{info.description}}
 * reverted from {{{info.title}}}
 */
import ajax from 'jingoal-silk/lib/ajax';
import queryString from 'query-string';

class {{clazzName}} {
    {{#methods}}

    /**
     * {{summary}}
     {{#parameters}}
     * @param \{ {{paramType}} \} {{name}} {{description}}
     {{/parameters}}
     */
    {{paramName}}({{paramsText}}) {
        return ajax({
            url: {{{path}}},
            type: '{{method}}',
            headers: {'janus-rest-action' : '1'}, // eslint-disable-line
            contentType: 'application/json',
            {{#body}}
            data: {{{body}}}
            {{/body}}
        });
    }
    {{/methods}}
}

export default new {{clazzName}}();
`