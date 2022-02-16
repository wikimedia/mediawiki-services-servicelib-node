'use strict';

const BBPromise = require('bluebird');
const sUtil = require('./util');
const Template = require('swagger-router').Template;
const HTTPError = sUtil.HTTPError;

/**
 * Calls the MW API with the supplied query as its body
 *
 * @param {!Object} req the incoming request object
 * @param {?Object} query an object with all the query parameters for the MW API
 * @param {?Object} headers additional headers to pass to the MW API
 * @return {!Promise} a promise resolving as the response object from the MW API
 */
function mwApiGet(req, query, headers) {

    const app = req.app;
    query = Object.assign({
        format: 'json',
        formatversion: 2
    }, query);

    const tpl = getActionApiTemplate( app );
    const request = tpl.expand({
        request: {
            params: { domain: req.params.domain },
            headers: req.headers,
            query
        }
    });
    Object.assign(request.headers, headers);

    return req.issueRequest(request).then((response) => {
        if (response.status < 200 || response.status > 399) {
            // there was an error when calling the upstream service, propagate that
            return BBPromise.reject(new HTTPError({
                status: response.status,
                type: 'api_error',
                title: 'MW API error',
                detail: response.body
            }));
        }
        return response;
    });

}

/**
 * Calls the REST API with the supplied domain, path and request parameters
 *
 * @param {!Object} req the incoming request object
 * @param {?string} path the REST API path to contact without the leading slash
 * @param {?Object} [restReq={}] the object containing the REST request details
 * @param {?string} [restReq.method=get] the request method
 * @param {?Object} [restReq.query={}] the query string to send, if any
 * @param {?Object} [restReq.headers={}] the request headers to send
 * @param {?Object} [restReq.body=null] the body of the request, if any
 * @return {!Promise} a promise resolving as the response object from the REST API
 *
 */
function restApiGet(req, path, restReq) {

    const app = req.app;
    if (path.constructor === Object) {
        restReq = path;
        path = undefined;
    }
    restReq = restReq || {};
    restReq.method = restReq.method || 'get';
    restReq.query = restReq.query || {};
    restReq.headers = restReq.headers || {};
    restReq.params = restReq.params || {};
    restReq.params.path = path || restReq.params.path;
    restReq.params.domain = restReq.params.domain || req.params.domain;
    if (!restReq.params.path || !restReq.params.domain) {
        return BBPromise.reject(new HTTPError({
            status: 500,
            type: 'internal_error',
            title: 'Invalid internal call',
            detail: 'domain and path need to be defined for the REST API call'
        }));
    }
    restReq.params.path = restReq.params.path[0] === '/' ?
        restReq.params.path.slice(1) : restReq.params.path;

    const tpl = getRestbaseTemplate( app );
    return req.issueRequest(tpl.expand({ request: restReq }));

}

/**
 * Gets a Template for MW action API calls
 *
 * @param {!Application} app the application object
 */
function getActionApiTemplate(app) {
    if ( app.mwapi_tpl ) {
        return app.mwapi_tpl;
    }

    // set up the MW API request template
    if (!app.conf.mwapi_req) {
        app.conf.mwapi_req = {
            method: 'post',
            uri: 'http://{{domain}}/w/api.php',
            headers: '{{request.headers}}',
            body: '{{ default(request.query, {}) }}'
        };
    }
    app.mwapi_tpl = new Template(app.conf.mwapi_req);
    return app.mwapi_tpl;
}

/**
 * Sets up the request templates for MW and RESTBase API requests
 *
 * @param {!Application} app the application object
 */
function getRestbaseTemplate(app) {
    if ( app.restbase_tpl ) {
        return app.restbase_tpl;
    }

    // set up the RESTBase request template
    if (!app.conf.restbase_req) {
        app.conf.restbase_req = {
            method: '{{request.method}}',
            uri: 'http://{{domain}}/api/rest_v1/{+path}',
            query: '{{ default(request.query, {}) }}',
            headers: '{{request.headers}}',
            body: '{{request.body}}'
        };
    }
    app.restbase_tpl = new Template(app.conf.restbase_req);
    return app.restbase_tpl;
}

module.exports = {
    mwApiGet,
    restApiGet
};
