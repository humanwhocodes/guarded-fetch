/**
 * @fileoverview Main entry point for the project.
 * @author Nicholas C. Zakas
 */

/* @ts-self-types="./index.d.ts" */

/**
 * @typedef {Object} GuardedFetchResult
 * @property {Response|undefined} response - The Response object if the fetch was successful
 * @property {any} error - The error if the fetch failed
 */

/**
 * Creates a guarded version of a fetch function that catches errors.
 * @param {typeof fetch} fetchFn - The fetch function to wrap
 * @returns {(...args: Parameters<typeof fetch>) => Promise<GuardedFetchResult>} A function that returns a promise with response and error properties
 */
export function createGuardedFetch(fetchFn) {
	return async (...args) => {
		try {
			const response = await fetchFn(...args);

			return { response, error: undefined };
		} catch (error) {
			return { response: undefined, error };
		}
	};
}

/**
 * A guarded version of the global fetch function that catches errors.
 * @type {(...args: Parameters<typeof fetch>) => Promise<GuardedFetchResult>}
 */
export const guardedFetch = createGuardedFetch(globalThis.fetch);
