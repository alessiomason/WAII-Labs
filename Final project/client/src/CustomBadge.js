import { Badge } from "react-bootstrap";
import './CustomBadge.css';

function classFromLabel(label) {
	switch (label) {
		case 'OPEN':
			return 'open-badge';
		case 'IN_PROGRESS':
			return 'in-progress-badge';
		case 'CLOSED':
			return 'closed-badge';
		case 'RESOLVED':
			return 'resolved-badge';
		case 'REOPENED':
			return 'reopened-badge';
		case 'PREPARING':
			return 'preparing-badge';
		case 'SHIPPED':
			return 'shipped-badge';
		case 'DELIVERED':
			return 'delivered-badge';
		case 'WITHDRAWN':
			return 'withdrawn-badge';
		case 'REFUSED':
			return 'refused-badge';
		case 'REPLACED':
			return 'replaced-badge';
		case 'REPAIRED':
			return 'repaired-badge';
		case '! LOW':
			return 'low-badge';
		case '!! NORMAL':
			return 'normal-badge';
		case '!!! HIGH':
			return 'high-badge';
		case '!!!! CRITICAL':
			return 'critical-badge';
		default:
			return '';
	}
}

function textFromLabel(label) {
	switch (label) {
		case 'OPEN':
			return 'OPEN';
		case 'IN_PROGRESS':
			return 'IN PROGRESS';
		case 'CLOSED':
			return 'CLOSED';
		case 'RESOLVED':
			return 'RESOLVED';
		case 'REOPENED':
			return 'REOPENED';
		case 'PREPARING':
			return 'PREPARING';
		case 'SHIPPED':
			return 'SHIPPED';
		case 'DELIVERED':
			return 'DELIVERED';
		case 'WITHDRAWN':
			return 'WITHDRAWN';
		case 'REFUSED':
			return 'REFUSED';
		case 'REPLACED':
			return 'REPLACED';
		case 'REPAIRED':
			return 'REPAIRED';
		case '! LOW':
			return '! LOW';
		case '!! NORMAL':
			return '!! NORMAL';
		case '!!! HIGH':
			return '!!! HIGH';
		case '!!!! CRITICAL':
			return '!!!! CRITICAL';
		default:
			return label;
	}
}

function CustomBadge(props) {
	return (
		<Badge className={classFromLabel(props.text)}>{textFromLabel(props.text)}</Badge>
	);
}

export default CustomBadge;