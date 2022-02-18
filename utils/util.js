'use strict';

const express = require('express');

/**
 * Error instance wrapping HTTP error responses
 */
class HTTPError extends Error {

    constructor(response) {
        super();
        Error.captureStackTrace(this, HTTPError);

        if (response.constructor !== Object) {
            // just assume this is just the error message
            response = {
                status: 500,
                type: 'internal_error',
                title: 'InternalError',
                detail: response
            };
        }

        this.name = this.constructor.name;
        this.message = `${response.status}`;
        if (response.type) {
            this.message += `: ${response.type}`;
        }

        Object.assign(this, response);
    }
}

/**
 * Creates a new router with some default options.
 *
 * @param {?Object} [opts] additional options to pass to express.Router()
 * @return {!Router} a new router object
 */
function createRouter(opts) {

    const options = {
        mergeParams: true
    };

    if (opts && opts.constructor === Object) {
        Object.assign(options, opts);
    }

    return new express.Router(options);
}

module.exports = {
    HTTPError,
    router: createRouter
};
