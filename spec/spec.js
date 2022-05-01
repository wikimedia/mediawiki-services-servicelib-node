'use strict';

const swaggerJSDoc = require('swagger-jsdoc');
const yamljs = require('yamljs');
const { resolveRefs } = require('json-refs');
const fs = require('fs');
const os = require('os');

/**
 * Add additional fields to the OpenAPI spec that are not present in package.json
 *
 * @param {Object} specObject Current OpenAPI spec
 * @param {Object} extraFields Key/values to add to specObject
 * @return {Object} Object with new fields added
 */
const addFields = (specObject, extraFields) => {
	const newObject = {
		...specObject,
		...extraFields
	};
	return newObject;
};

/**
 * Generate a base "info" object for the OpenAPI spec
 *
 * @param {Object} packageObject package.json metadata
 * @return {Object} OpenAPI "info" object
 */
const generateInfoObj = (packageObject) => {
	const { name, version, description } = packageObject;
	return {
		info: {
			title: name,
			version,
			description
		}
	};
};

/**
 * Parse provided routes for function comments to generate a base OpenAPI spec with info and
 * route keys.
 *
 * @param {Object} serviceInfo package.json metadata
 * @param {Array} routes Path(s) to files and/or directories with function comments to
 * insert in the openAPI spec. Paths may contain regex.
 * @return {Object} OpenAPI spec with service info and unresolved route definitions
 */
const getBaseSpec = (serviceInfo, routes) => {
	const baseObject = generateInfoObj(serviceInfo);
	const swaggerDefinition = {
		openapi: '3.0.0',
		...baseObject
	};

	const options = {
		swaggerDefinition,
		apis: routes
	};

	try {
		return swaggerJSDoc(options);
	} catch (err) {
		throw new Error('Could not generate base spec. Verify valid config and routes file paths.');
	}
};

/**
 * Return JSON with resolved $ref references
 *
 * @param {Object} root The structure to find JSON references within
 * @return {Object} The resolved JSON
 * @throws {Error}
 */
const multiFileSpec = async (root) => {
	const options = {
		filter: [ 'relative', 'remote' ],
		loaderOptions: {
			processContent: (res, cb) => {
				cb(null, yamljs.parse(res.text));
			}
		}
	};
	try {
		const result = await resolveRefs(root, options);
		return result.resolved;
	} catch (err) {
		throw new Error(err);
	}
};

/**
 * Main function for generating an OpenAPI v3 spec
 *
 * @param {Object} serviceInfo package.json metadata for generating spec 'info' object
 * @param {Array} routes Paths to files and/or directories with JSDoc to insert in the openAPI spec.
 * Paths may contain regex.
 * @return {Object} Complete OpenAPI spec with resolved $refs
 */
const generateSpec = async (serviceInfo, routes) => {
	const baseSpec = getBaseSpec(serviceInfo, routes);
	const resolvedSpec = await multiFileSpec(baseSpec);
	return resolvedSpec;
};

const writeSpec = (spec, path) => {
	if (!path.match(/\.json$/g)) {
		throw new Error('Provided path to write spec to should have .json extension');
	}
	try {
		fs.writeFileSync(path, JSON.stringify(spec, null, '\t') + os.EOL);
	} catch (error) {
		throw new Error(`Failed to write OpenAPI spec to ${path}`);
	}
};

module.exports = {
	generateSpec,
	writeSpec,
	addFields, // for testing
	getBaseSpec // for testing
};
