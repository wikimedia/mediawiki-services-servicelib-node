'use strict'

const apiUtils = require('../utils/api-util')

const { expect } = require("chai");
const chai = require("chai");

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe("test", function() {
    it("returns a rejected promise", function() {
        let req = {
            params: {
                domain: {}
            },
            headers: {},
            app: {
                mwapi_tpl: {
                    expand: ( ) => { return { headers: {}} },
                }
            },
            issueRequest: ()=> {
                return Promise.resolve({ status: 100 });
            }
        }

        let res = apiUtils.mwApiGet(req, {}, {})

        return expect(res).to.eventually.be.rejected.and.be.an.instanceOf(Error)
            .and.have.property('type', 'api_error');
    });

    it("returns a resolved promise", function() {
        let req = {
            params: {
                domain: {}
            },
            headers: {},
            app: {
                mwapi_tpl: {
                    expand: ( ) => { return { headers: {}} },
                }
            },
            issueRequest: ()=> {
                return Promise.resolve({ status: 300 });
            }
        }

        let res = apiUtils.mwApiGet(req, {}, {});

        return expect(res).to.eventually.deep.equal({ status: 300 });
    });
});