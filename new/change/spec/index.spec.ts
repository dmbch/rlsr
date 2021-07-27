/* eslint-env node, jest */
// This prevents re-declaration warnings
// @SEE: https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};

const mockComposeAsyncResult = 'Compose Async Result';
const mockComposeAsync = jest.fn(() => mockComposeAsyncResult);
const mockWaitResult = 'mock Wait Result';
const mockWait = jest.fn(() => mockWaitResult);
const mockLogResult = jest.fn();
const mockLog = jest.fn(() => mockLogResult);

const mockWritePackageJsonsToNpm = jest.fn();
const mockWriteMainChangelog = jest.fn();
const mockWritePackageChangelogs = jest.fn();

jest.mock('../../helpers/compose-async', () => ({
  composeAsync: mockComposeAsync,
}));
jest.mock('../../helpers/wait-module', () => ({ wait: mockWait }));
jest.mock('../../helpers/log-module', () => ({ log: mockLog }));

jest.mock('../write-package-jsons-to-npm', () => ({
  writePackageJsonsToNpm: mockWritePackageJsonsToNpm,
}));
jest.mock('../write-main-changelog', () => ({
  writeMainChangelog: mockWriteMainChangelog,
}));
jest.mock('../write-package-changelogs', () => ({
  writePackageChangelogs: mockWritePackageChangelogs,
}));

describe("change's Index", () => {
  let result: typeof mockComposeAsyncResult;
  beforeAll(() => {
    result = require('../index').change;
  });

  // Test Steps' order
  test('composeAsync is called once', () => {
    expect(mockComposeAsync).toBeCalledTimes(1);
  });

  test('1. logs a description', () => {
    // @ts-ignore
    expect(mockComposeAsync.mock.calls[0][0]).toBe(mockLogResult);
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      'CHANGE PHASE: writing all relevant files locally'
    );
  });

  test('2. writes package.json files for NPM', () => {
    // @ts-ignore
    expect(mockComposeAsync.mock.calls[0][1]).toBe(mockWritePackageJsonsToNpm);
  });

  test('3. writes main changelog', () => {
    // @ts-ignore
    expect(mockComposeAsync.mock.calls[0][2]).toBe(mockWriteMainChangelog);
  });

  test('4. writes changelos per packages', () => {
    // @ts-ignore
    expect(mockComposeAsync.mock.calls[0][3]).toBe(mockWritePackageChangelogs);
  });

  test('calls "wait(1000)" at the end', () => {
    const lastComposeArgument =
      mockComposeAsync.mock.calls[0][mockComposeAsync.mock.calls[0].length - 1];
    expect(mockWait).toHaveBeenCalledTimes(1);
    expect(mockWait).toHaveBeenCalledWith(1000);
    expect(lastComposeArgument).toBe(mockWaitResult);
  });

  // Aditional tests
  test(`exports "composeAsync"'s result as "collect"`, () => {
    expect(result).toBe(mockComposeAsyncResult);
  });
});
