/**
 * DOCUMENTATION: https://nextjs.org/docs/app/guides/progressive-web-apps
 * Converts a URL-safe base64 string to a Uint8Array.
 * This is commonly used for handling VAPID keys in web push notifications.
 * @param base64String - The URL-safe base64 encoded string.
 * @returns A Uint8Array representation of the decoded base64 string.
 */
export function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
