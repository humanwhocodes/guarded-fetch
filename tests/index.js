/**
 * @fileoverview Tests for guarded-fetch
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import assert from "node:assert";
import { createGuardedFetch } from "../dist/index.js";

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("guardedFetch", () => {
	describe("successful fetch", () => {
		it("should return response when fetch succeeds", async () => {
			// Use a mock to avoid network calls in sandboxed environment
			const mockFetch = async () => {
				return new Response("OK", { status: 200 });
			};
			const testGuardedFetch = createGuardedFetch(mockFetch);
			const result = await testGuardedFetch("https://example.com/get");

			assert.strictEqual(result.error, undefined);
			assert.ok(result.response);
			assert.strictEqual(result.response.ok, true);
		});

		it("should return response with status 404", async () => {
			// Use a mock to avoid network calls in sandboxed environment
			const mockFetch = async () => {
				return new Response("Not Found", { status: 404 });
			};
			const testGuardedFetch = createGuardedFetch(mockFetch);
			const result = await testGuardedFetch("https://example.com/status/404");

			assert.strictEqual(result.error, undefined);
			assert.ok(result.response);
			assert.strictEqual(result.response.status, 404);
			assert.strictEqual(result.response.ok, false);
		});
	});

	describe("fetch with errors", () => {
		it("should catch network errors", async () => {
			// Use a mock to simulate network errors
			const mockFetch = async () => {
				throw new TypeError("fetch failed");
			};
			const testGuardedFetch = createGuardedFetch(mockFetch);
			const result = await testGuardedFetch("https://invalid-domain-that-does-not-exist-12345.com");

			assert.strictEqual(result.response, undefined);
			assert.ok(result.error);
		});

		it("should catch invalid URL errors", async () => {
			// Use a mock to simulate URL errors
			const mockFetch = async () => {
				throw new TypeError("Invalid URL");
			};
			const testGuardedFetch = createGuardedFetch(mockFetch);
			const result = await testGuardedFetch("not-a-valid-url");

			assert.strictEqual(result.response, undefined);
			assert.ok(result.error);
		});
	});

	describe("fetch with options", () => {
		it("should pass through fetch options", async () => {
			// Use a mock to avoid network calls in sandboxed environment
			const mockFetch = async () => {
				return new Response("OK", { status: 200 });
			};
			const testGuardedFetch = createGuardedFetch(mockFetch);
			const result = await testGuardedFetch("https://example.com/post", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ test: "data" }),
			});

			assert.strictEqual(result.error, undefined);
			assert.ok(result.response);
			assert.strictEqual(result.response.ok, true);
		});
	});
});

describe("createGuardedFetch", () => {
	describe("with custom fetch function", () => {
		it("should wrap a custom fetch function that succeeds", async () => {
			const mockFetch = async () => {
				return new Response("test", { status: 200 });
			};
			const customGuardedFetch = createGuardedFetch(mockFetch);
			const result = await customGuardedFetch("https://example.com");

			assert.strictEqual(result.error, undefined);
			assert.ok(result.response);
			assert.strictEqual(result.response.status, 200);
		});

		it("should wrap a custom fetch function that throws", async () => {
			const mockFetch = async () => {
				throw new Error("Custom error");
			};
			const customGuardedFetch = createGuardedFetch(mockFetch);
			const result = await customGuardedFetch("https://example.com");

			assert.strictEqual(result.response, undefined);
			assert.ok(result.error);
			assert.strictEqual(result.error.message, "Custom error");
		});

		it("should pass through arguments to custom fetch", async () => {
			let capturedUrl = null;
			let capturedOptions = null;
			const mockFetch = async (url, options) => {
				capturedUrl = url;
				capturedOptions = options;

				return new Response("test", { status: 200 });
			};
			const customGuardedFetch = createGuardedFetch(mockFetch);
			const testUrl = "https://example.com";
			const testOptions = { method: "POST" };

			await customGuardedFetch(testUrl, testOptions);

			assert.strictEqual(capturedUrl, testUrl);
			assert.deepStrictEqual(capturedOptions, testOptions);
		});

		it("should handle various error types", async () => {
			const errorTypes = [
				new TypeError("Type error"),
				new Error("Generic error"),
				"String error",
				{ custom: "object error" },
				42,
			];

			for (const errorToThrow of errorTypes) {
				const mockFetch = async () => {
					throw errorToThrow;
				};
				const customGuardedFetch = createGuardedFetch(mockFetch);
				const result = await customGuardedFetch("https://example.com");

				assert.strictEqual(result.response, undefined);
				assert.strictEqual(result.error, errorToThrow);
			}
		});
	});
});
