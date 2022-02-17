'use strict';

const swaggerUi = require('./swagger-ui');

const getSpecRoutHandler = ( spec ) => {
	return  (req, res, next) => {
		if ({}.hasOwnProperty.call(req.query || {}, 'spec')) {
			res.json(spec);
		} else {
			next();
		}
	};
};

const getSwaggerUiRoutHandler = ( app ) => {
	return  (req, res, next) => {
		if ({}.hasOwnProperty.call(req.query || {}, 'doc')) {
			return swaggerUi.processRequest(app, req, res);
		} else {
			next();
		}
	};
};

module.exports = {
	getSpecRoutHandler,
	getSwaggerUiRoutHandler
}
