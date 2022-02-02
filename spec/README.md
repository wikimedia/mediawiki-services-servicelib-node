# servicelib-node/spec

The spec package within servicelib-node is for automatically generating an OpenAPI v3 specification in YAML from JSDoc YAML. servicelib-node/spec will combine all JSDoc YAML in valid OpenAPI format from the specificed route files into a single OpenAPI YAML file.

JSDoc blocks for each route require an `@openapi` annotation.
In this example, $ref references `test/fixtures/test-component.yaml` and will be resolved to the YAML object from `test-component.yaml`.

```
/**
 * @openapi
 * /hello:
 *   get:
 *     summary: Hello World dndpoint
 *     description: Echoes back hello world
 *     tags:
 *       - Example API
 *     responses:
 *       200:
 *          description: Success
 *          content:
 *           application/json:
 *             schema:
 *               $ref: 'test/fixtures/test-component.yaml'
 *
 */
router.get('/hello', (req, res) => {});
```

# Usage

To generate the specification, you can either use the CLI executable or explicitly call its functions.

## <b>Command Line</b>

```
servicelib-spec -- <info-path> <routes-path> [spec-path]
```

<b>info-path</b>

Path to JSON file used to populate the Open API [Info object](https://swagger.io/specification/#info-object). Must include `name`, `description`, and `version` values. Typically this should be the relative path to `package.json`. However, you may provide a path to a different `.json` config file if there are additional values that are not apart of your `package.json` that you would like included in the Info object.

<b>routes-path</b>

Path to directory with route files containing OpenAPI JSDoc yaml.
Example: `./routes/*.js` will search all JavaScript files for `@openapi` annotations.

#### Optional

<b>[spec-path]</b>
The path to write the openapi spec file to. Default value is `./static/openapi.yaml` (which assumes a `/static` directory exists).

---

## <b>Function call</b>

This package also exposes functions to call explicitly, if you prefer not to use the CLI executable. The main difference being that you can provide a JSON object that contains the required `name`, `version`, and `description` attributes instead of providing a path to a file.

### <b>generateScript(info-path, routes-path)</b>
Returns the OpenAPI spec in YAML

<!-- ```Returns the openapi spec in YAML
`generateScript()` -->

### <b>writeFile(spec-path)</b>
Write the generated YAML spec to a file
<!-- `writeFile(./static/openapi.yaml)` -->

Example:

```
const { spec } = require('servicelib-node/spec);

const serviceInfo = { name: 'my-name', description: 'my-desc', version: '1.0.0' }

// generate the spec as
const openapiSpec = spec.generateScript(serviceInfo, ./path/to/routes/*.js);

// writes the spec to specific path
spec.writefile(./static/openapi.yaml);
```
