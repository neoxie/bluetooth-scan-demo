import { BluetoothDevice } from '../types';

export const isBluetoothSupported = (): boolean => {
  if (typeof window === 'undefined' || !navigator) return false;
  return !!navigator.bluetooth;
};

export const requestBluetoothDevice = async (): Promise<BluetoothDevice> => {
  if (!isBluetoothSupported()) {
    throw new Error('Web Bluetooth API is not available in this browser.');
  }

  try {
    // Requesting a device opens the native browser picker.
    // We use acceptAllDevices: true to see everything, but must provide optionalServices
    // if we want to access specific GATT characteristics later.
    // Common services: 'battery_service', 'device_information'
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'device_information']
    });

    return device;
  } catch (error: unknown) {
    if (error instanceof Error) {
        // User cancelled the picker usually throws a generic error
        if (error.name === 'NotFoundError') {
            throw new Error('User cancelled device selection.');
        }
        throw error;
    }
    throw new Error('An unknown error occurred while scanning.');
  }
};

export const connectToDevice = async (device: BluetoothDevice): Promise<BluetoothDevice> => {
  if (device.gatt) {
    await device.gatt.connect();
    return device;
  }
  throw new Error('Device does not support GATT connection.');
};

export const disconnectDevice = (device: BluetoothDevice): void => {
  if (device.gatt && device.gatt.connected) {
    device.gatt.disconnect();
  }
};
