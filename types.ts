export interface BluetoothRemoteGATTService {
  isPrimary: boolean;
  uuid: string;
}

export interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryServices(): Promise<BluetoothRemoteGATTService[]>;
}

export interface BluetoothDevice extends EventTarget {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  watchAdvertisements(): Promise<void>;
  unwatchAdvertisements(): void;
  readonly watchingAdvertisements: boolean;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
}

export interface BluetoothRequestDeviceOptions {
  filters?: Array<{
    services?: Array<string | number>;
    name?: string;
    namePrefix?: string;
    manufacturerData?: Array<{
      companyIdentifier: number;
      dataPrefix?: BufferSource;
      mask?: BufferSource;
    }>;
    serviceData?: Array<{
      service: string | number;
      dataPrefix?: BufferSource;
      mask?: BufferSource;
    }>;
  }>;
  optionalServices?: Array<string | number>;
  acceptAllDevices?: boolean;
}

export interface NavigatorBluetooth {
  requestDevice(options?: BluetoothRequestDeviceOptions): Promise<BluetoothDevice>;
  getAvailability(): Promise<boolean>;
}

// Extend the global Navigator interface
declare global {
  interface Navigator {
    bluetooth: NavigatorBluetooth;
  }
}
