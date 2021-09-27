'use strict';

const packageInfo = require('../package.json');

app.info = packageInfo;
/**
 * GET /
 * Gets some basic info
 */

const healthz = () => {
    return (req, res) => {
        res.json({
            version: app.info.version,
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
