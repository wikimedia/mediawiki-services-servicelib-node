'use strict';

const registerErrorRoutes = require('./errors');
const registerApiRoutes = require('./api');
const registerMiscRoutes = require('./misc');

module.exports = {
	registerErrorRoutes,
	registerApiRoutes,
	registerMiscRoutes,
}
