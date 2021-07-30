/* eslint-env node, jest */
// This prevents re-declaration warnings
// @SEE: https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};

const mockComposeAsyncResult = 'Persist Async Result';
const mockComposeAsync = jest.fn(() => mockComposeAsyncResult);
const mockWaitResult = 'mock Wait Result';
const mockWait = jest.fn(() => mockWaitResult);
const mockLogResult = jest.fn();
const mockLog = jest.fn(() => mockLogResult);

const mockPublish = jest.fn();
const mockWritePackageJsonsForGit = jest.fn();

jest.mock('../../helpers/compose-async', () => ({
  composeAsync: mockComposeAsync,
}));
jest.mock('../../helpers/wait-module', () => ({ wait: mockWait }));
jest.mock('../../helpers/log-module', () => ({ log: mockLog }));

jest.mock('../publish', () => ({
  publish: mockPublish,
}));
jest.mock('../write-package-jsons-for-git', () => ({
  writePackageJsonsForGit: mockWritePackageJsonsForGit,
}));

describe("persist's Index", () => {
  let result: typeof mockComposeAsyncResult;
  beforeAll(() => {
    result = require('../index').persist;
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
      'PERSIST PHASE: publishing files and committing to git'
    );
  });

  test('2. publishes changes to NPM', () => {
    // @ts-ignore
    expect(mockComposeAsync.mock.calls[0][1]).toBe(mockPublish);
  });

  test('3. write package.json files for git', () => {
    // @ts-ignore
    expect(mockComposeAsync.mock.calls[0][2]).toBe(mockWritePackageJsonsForGit);
  });

  test('calls "wait(1000)" at the end', () => {
    const lastComposeArgument =
      mockComposeAsync.mock.calls[0][mockComposeAsync.mock.calls[0].length - 1];
    expect(mockWait).toHaveBeenCalledTimes(1);
    expect(mockWait).toHaveBeenCalledWith(1000);
    expect(lastComposeArgument).toBe(mockWaitResult);
  });

  // Aditional tests
  test(`exports "composeAsync"'s result as "persist"`, () => {
    expect(result).toBe(mockComposeAsyncResult);
  });
});
