export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const toRadians = (degrees: number) => degrees * (Math.PI / 180);

	const R = 6371; // Earth's radius in kilometers
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c; // Distance in kilometers
}

export function calculateBearing(point1: [number, number], point2: [number, number]): number {
	// Extract coordinates
	const [x1, y1] = point1;
	const [x2, y2] = point2;

	// Calculate the differences
	const dx = x2 - x1;
	const dy = y2 - y1;

	// Calculate the angle in radians
	const angleRadians = Math.atan2(dx, dy);

	// Convert radians to degrees
	let angleDegrees = angleRadians * (180 / Math.PI);

	// Adjust to make 0° = north and clockwise positive
	//angleDegrees = (angleDegrees + 360) % 360;

	return angleDegrees;
}
