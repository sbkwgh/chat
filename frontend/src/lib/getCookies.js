export default function getCookies () {
	let pairs = document.cookie.split(';').map(pair => pair.trim());
	let obj = {};

	pairs.forEach(pair => {
		let [key, value] = pair.split('=');
		obj[key] = value;
	});

	return obj;
}