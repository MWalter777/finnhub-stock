const nextJest = require('next/jest');

const createJestConfig = nextJest({
	dir: './',
});

const config = {
	clearMocks: true,
	preset: 'ts-jest',
	coverageDirectory: 'coverage',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'\\.(css|scss|sass)$': 'identity-obj-proxy', // mock CSS modules
	},
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	transformIgnorePatterns: ['/node_modules/'],

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: ['\\.styled\\.ts$', '/node_modules/'],

	coverageProvider: 'v8',

	testEnvironment: 'jest-environment-jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

	// An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
	// testPathIgnorePatterns: [
	//   "\\\\node_modules\\\\"
	// ],
};

export default createJestConfig(config);
