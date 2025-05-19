export function polarToCartesian(centerX: number, centerY: number, radius: number, angleDegrees: number) {
    const angleRadians = (angleDegrees - 90) * (Math.PI / 180);
    return {
        x: centerX + radius * Math.cos(angleRadians),
        y: centerY + radius * Math.sin(angleRadians),
    };
}