# Test Results Documentation

## Overview
- Total Test Suites: 1
- Total Tests: 5
- Passed Tests: 4
- Failed Tests: 1
- Test Execution Time: 15.531 s

## Test Suite: User Model and Controller Test

### User Model Tests
1. ✓ should create & save user successfully (1415 ms)
2. ✓ should fail to create a duplicate user (571 ms)

### User Controller Tests
3. ✓ should create a new user (557 ms)
4. ✓ should get user profile (572 ms)
5. ✕ should return 404 for non-existent user (375 ms)

## Detailed Test Results

### Passing Tests
1. User Model: Creating and saving a user works as expected.
2. User Model: Attempting to create a duplicate user throws an error as expected.
3. User Controller: Creating a new user via the controller function works correctly.
4. User Controller: Retrieving a user profile via the controller function works correctly.

### Failing Test
5. User Controller: Returning a 404 for a non-existent user

#### Error Details