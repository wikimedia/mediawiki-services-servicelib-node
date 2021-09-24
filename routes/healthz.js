'use strict';

const sUtil = require('../utils/util');

/**
 * The main router object
 */
const router = sUtil.router();

/**
 * GET /
 * Gets some basic info
 */

router.get('/', (req, res) => {

    // async returns
    res.json({
        version: '',
        build_date: '',
        build_host: '',
    });
});

/**
 * GET /version
 * Gets the healthz version
 */
router.get('/version', (req, res) => {

    // simple return
    res.json({ version: ''});

});

module.exports = (appObj) => {

    return {
        path: '/healthz',
        skip_domain: true,
        router
    };

};
