#!/usr/bin/env node

'use strict';

const fs = require('fs');
const spec = require('./spec');

// Entrypoint for package as executable
if (require.main === module) {
	if (process.argv && process.argv.length > 4) {
		const configPath = process.argv[ 3 ];
		const routesDir = process.argv[ 4 ];
		const writePath = process.argv[ 5 ] ? process.argv[ 5 ] : './static/spec.json';
		fs.readFile(configPath, 'utf8', async (err, data) => {
			if (err) {
				throw new Error(`Failed to read file at ${configPath}`);
			}
			const packageObject = JSON.parse(data);
			const openApiSpec = await spec.generateSpec(packageObject, [ routesDir ]);
			spec.writeSpec(openApiSpec, writePath);
		});
	} else {
		throw new Error('Usage: servicelib-spec -- info-path routes-path spec-path');
	}
}
