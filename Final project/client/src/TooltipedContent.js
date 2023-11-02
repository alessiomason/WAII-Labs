import { Tooltip, OverlayTrigger } from "react-bootstrap";

function TooltipedContent({ id, text, children }) {
	return (
		<OverlayTrigger overlay={<Tooltip id={id}>{text}</Tooltip>}>
			<a href="#">{children}</a>
		</OverlayTrigger>
	);
}

function capitalize(text) {
	return text[0].toUpperCase() + text.substring(1).toLowerCase();
}

export { TooltipedContent, capitalize };