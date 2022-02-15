'use strict';

const swaggerUi = require('./swagger-ui');

const getSpecRouteHandler = ( spec ) => {
	return  (req, res, next) => {
		if ({}.hasOwnProperty.call(req.query || {}, 'spec')) {
			res.json(spec);
		} else {
			next();
		}
	};
};

const getSwaggerUiRouteHandler = ( app ) => {
	return  (req, res, next) => {
		if ({}.hasOwnProperty.call(req.query || {}, 'doc')) {
			return swaggerUi.processRequest(app, req, res);
		} else {
			next();
		}
	};
};

const getHealthZRouteHandler = ( app, checkStatus ) => {
	return ( req, res ) => {
		res.json({
			name: app.info.name,
			version: app.info.version,
			status: checkStatus()
		});
	}
}

module.exports = {
	getSpecRouteHandler,
	getSwaggerUiRouteHandler,
	getHealthZRouteHandler
}
