/* eslint-env jest */
jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  return {
    useCameraDevice: jest.fn(() => null),
    useCameraFormat: jest.fn(() => undefined),
    useCameraPermission: jest.fn(() => ({
      hasPermission: true,
      requestPermission: jest.fn(),
    })),
    Camera: (props = {}) =>
      React.createElement('View', { testID: 'camera', ...props }),
  };
});

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(() => Promise.resolve('')),
}));