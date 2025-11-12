# Guarded Fetch

by [Nicholas C. Zakas](https://humanwhocodes.com)

If you find this useful, please consider supporting my work with a [donation](https://humanwhocodes.com/donate).

## Description

A wrapper around `fetch()` that catches errors and returns them in a consistent format. Instead of using `try-catch` blocks, you can use `guardedFetch()` which always returns an object with `response` and `error` properties.

## Installation

```shell
npm install @humanwhocodes/guarded-fetch
```

## Usage

### Using guardedFetch (with global fetch)

The `guardedFetch` function is a wrapped version of the global `fetch()` function:

```js
import { guardedFetch } from "@humanwhocodes/guarded-fetch";

// Successful request
const { response, error } = await guardedFetch("https://api.example.com/data");
if (error) {
	console.error("Fetch failed:", error);
} else {
	console.log("Response:", response);
}

// Failed request (network error)
const { response: response2, error: error2 } = await guardedFetch("https://invalid-domain.example");
if (error2) {
	console.error("Fetch failed:", error2); // Error will be defined
}

// HTTP error (like 404)
const { response: response3, error: error3 } = await guardedFetch("https://api.example.com/not-found");
if (error3) {
	console.error("Fetch failed:", error3);
} else if (!response3.ok) {
	console.log("HTTP error:", response3.status);
}
```

### Using createGuardedFetch (with custom fetch)

You can wrap any `fetch()` implementation using `createGuardedFetch()`:

```js
import { createGuardedFetch } from "@humanwhocodes/guarded-fetch";
import nodeFetch from "node-fetch";

const guardedNodeFetch = createGuardedFetch(nodeFetch);

const { response, error } = await guardedNodeFetch("https://api.example.com/data");
if (error) {
	console.error("Fetch failed:", error);
} else {
	console.log("Response:", response);
}
```

### Return Value

Both `guardedFetch()` and the function returned by `createGuardedFetch()` return a promise that resolves to an object with the following properties:

- `response` - The `Response` object if the fetch was successful, or `undefined` if an error occurred
- `error` - Any error thrown by `fetch()` (type: `any`), or `undefined` if the fetch was successful

Note: HTTP errors (like 404 or 500) are NOT treated as errors by `fetch()`. You need to check `response.ok` or `response.status` to handle HTTP errors.

## License

Copyright 2025 Nicholas C. Zakas

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
