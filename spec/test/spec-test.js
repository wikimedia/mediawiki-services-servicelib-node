'use strict';

const { assert } = require('chai');
const spec = require('../spec');
const { exec } = require('child_process');

describe('Spec generation', () => {
	const info = {
		title: 'Test-API',
		version: '1.0.0',
		description: 'test-description'
	};

	it('Should return the base spec from a package.json object', () => {
		const serviceInfo = {
			name: 'Test-API',
			version: '1.0.0',
			description: 'test-description',
			license: 'MIT'
		};
		const expectedObject = {
			openapi: '3.0.0',
			info,
			paths: {},
			tags: [],
			components: {}
		};
		const result = spec.getBaseSpec(serviceInfo, [ './fake/route' ]);
		assert.deepEqual(expectedObject, result);
	});

	it('Should resolve $refs in route definitions', async () => {
		const serviceInfo = {
			name: 'Test-API',
			version: '1.0.0',
			description: 'test-description',
			license: 'MIT'
		};
		const result = await spec.generateSpec(serviceInfo, [ './test/fixtures/*.js' ]);
		assert.deepNestedInclude(
			result.paths['/test'].get.responses['200'].content['application/json'].schema, {
			properties: {
				message: {
					type: 'string'
				}
			}
		});
	});

	it('Should add additional properties package.json doesnt have', () => {
		const packageJsonObject = {
			name: 'Test-API',
			version: '1.0.0',
			description: 'test-description'
		};
		const result = spec.getBaseSpec(packageJsonObject, []);
		const expectedObject = {
			openapi: '3.0.0',
			info,
			paths: {},
			tags: [],
			components: {}
		};
		assert.deepEqual(expectedObject, result);

		const expectedNewObject = {
			openapi: '3.0.0',
			info,
			paths: {},
			tags: [ 'supah-coo-tag' ],
			components: {},
			servers: [{
				url: 'http://localhost:6927/',
				description: 'Development server'
			}]
		};

		const newObject = spec.addFields(result, { tags: [ 'supah-coo-tag' ],
			servers: [{
				url: 'http://localhost:6927/',
				description: 'Development server'
			}]
		});
		assert.deepEqual(expectedNewObject, newObject);
	});

	it('Should throw error for non-existent routes path', async () => {
		assert.throws(() => {
			spec.getBaseSpec({}, './non-existent/routes/');
		}, 'Could not generate base spec. Verify valid config and routes file paths');
	});

	it('Should throw error for incorrect write path extension', async () => {
		assert.throws(() => {
			spec.writeSpec({}, '/path/spec.yaml');
		}, 'Provided path to write spec to should have .json extension');
	});

	it('Should throw error for non-existent write path directory', async () => {
		assert.throws(() => {
			spec.writeSpec({}, './fake/path/spec.json');
		}, 'Failed to write OpenAPI spec to ./fake/path/spec.json');
	});

	it('Should throw error for non-existent config parameter', async () => {
			exec('node ./index.js -- ./i-dont-exist-package.json /some/routes ./myspec.json', (err, stdout, stderr) => {
				assert.isNotNull(stderr);
				assert.match(stderr, /Failed to read file at/);
			});
	});
});
