const COLOR_LIST = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD",
    "#E74C3C", "#27AE60", "#2980B9", "#D35400", "#2C3E50"];

function getRandomHexColor(): string {
    const randomIndex = Math.floor(Math.random() * COLOR_LIST.length);
    return COLOR_LIST[randomIndex];
}

export default getRandomHexColor;
