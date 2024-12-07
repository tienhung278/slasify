module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',  // Use 'node' if testing non-DOM environments
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};