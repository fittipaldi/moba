// test/utils.test.ts
import {getRandomHexColor, getDistanceBetween2Dots, generateRandomNumber} from '../src/utils';

// Mock COLOR_LIST to control the output for getRandomHexColor
jest.mock('../src/utils', () => ({
    ...jest.requireActual('../src/utils')
}));

describe('Utils Functions', () => {

    // Test for getRandomHexColor()
    test('should return a valid color from COLOR_LIST', () => {
        // Mock the Math.random() to return a specific value
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
        const color = getRandomHexColor();
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/); // Check that it matches a hex color format

        // Restore Math.random() to original state
        jest.spyOn(Math, 'random').mockRestore();
    });

    // Test for getDistanceBetween2Dots()
    test('should calculate the correct distance between two points', () => {
        const distance = getDistanceBetween2Dots(0, 0, 3, 4);
        expect(distance).toBe(5); // Distance between (0, 0) and (3, 4) is 5 (Pythagoras theorem)
    });

    // Test for generateRandomNumber()
    test('should generate a random number within the specified range and interval', () => {
        // Mock Math.random() for predictable output
        jest.spyOn(Math, 'random').mockReturnValue(0.5); // Random number in middle of range
        const randomNumber = generateRandomNumber(10, 50, 5);
        expect(randomNumber).toBe(30); // 10 + (Math.floor(0.5 * (40 / 5)) * 5) = 30

        jest.spyOn(Math, 'random').mockRestore(); // Restore Math.random()
    });
});
