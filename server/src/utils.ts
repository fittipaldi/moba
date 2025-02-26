const COLOR_LIST = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD",
    "#E74C3C", "#27AE60", "#2980B9", "#D35400", "#2C3E50"];

export function getRandomHexColor(): string {
    const randomIndex = Math.floor(Math.random() * COLOR_LIST.length);
    return COLOR_LIST[randomIndex];
}

export function getDistanceBetween2Dots(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function generateRandomNumber(min: number = 0, max: number = 760, interval: number = 10): number {
    const randomMultiplier = Math.floor(Math.random() * ((max - min) / interval + 1));
    return min + randomMultiplier * interval;
}