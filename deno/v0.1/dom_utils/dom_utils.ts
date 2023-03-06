class DOMUtils {
	createNode(tagname: string) {
		return document.createNode(tagname);
	}
	createTextNode(text: string) {
		return document.createTextNode(text);
	}
}

export { DOMUtils }
