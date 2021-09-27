'use strict';

const packageInfo = require('../package.json');

app.healthz = packageInfo;
/**
 * GET /
 * Gets some basic info
 */

const healthz = () => {
    return (req, res) => {
        res.json({
            version: app.healthz.version,
            build_date: '',
            build_host: '',
        });
    }

}

module.exports = (appObj) => {

    return {
        path: '/healthz',
        skip_domain: true,
        router
    };

};
