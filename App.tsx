import React, { useState, useEffect, useCallback } from 'react';
import { BluetoothDevice } from './types';
import { requestBluetoothDevice, connectToDevice, disconnectDevice, isBluetoothSupported } from './services/bluetoothService';
import { DeviceInfo } from './components/DeviceInfo';
import { Button } from './components/Button';
import { BluetoothIcon } from './components/BluetoothIcon';

const App: React.FC = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  // Track connection status by device ID
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, boolean>>({});
  // Track loading status by device ID
  const [loadingDevices, setLoadingDevices] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setIsSupported(isBluetoothSupported());
  }, []);

  // Update connection status helper
  const updateConnectionStatus = useCallback((deviceId: string, isConnected: boolean) => {
    setConnectionStatuses(prev => ({ ...prev, [deviceId]: isConnected }));
  }, []);

  const handleScan = async () => {
    setError(null);
    setIsScanning(true);
    try {
      const selectedDevice = await requestBluetoothDevice();
      
      // Check if device is already in the list to prevent duplicates
      const isDeviceAlreadyAdded = devices.some(device => device.id === selectedDevice.id);
      
      if (isDeviceAlreadyAdded) {
        setError(`Device "${selectedDevice.name || 'Unknown Device'}" is already in your list.`);
        return;
      }
      
      setDevices(prev => [...prev, selectedDevice]);

      // Initialize status
      updateConnectionStatus(selectedDevice.id, selectedDevice.gatt?.connected || false);

      // Add listener for this specific device
      selectedDevice.addEventListener('gattserverdisconnected', () => {
        updateConnectionStatus(selectedDevice.id, false);
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        // Ignore "User cancelled" error to avoid noise
        if (!err.message.includes('cancelled')) {
           setError(err.message);
        }
      } else {
        setError('Failed to scan for devices.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleConnect = async (device: BluetoothDevice) => {
    setLoadingDevices(prev => ({ ...prev, [device.id]: true }));
    setError(null);
    try {
      await connectToDevice(device);
      updateConnectionStatus(device.id, true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('Unsupported device')) {
           setError(`Could not connect to ${device.name || 'Device'}: Browser blocked this device type for security.`);
        } else {
           setError(`Connection failed for ${device.name || 'Device'}: ${err.message}`);
        }
      } else {
        setError('Connection failed.');
      }
    } finally {
      setLoadingDevices(prev => ({ ...prev, [device.id]: false }));
    }
  };

  const handleDisconnect = (device: BluetoothDevice) => {
    try {
      disconnectDevice(device);
      updateConnectionStatus(device.id, false);
    } catch (e) {
      console.warn("Disconnect failed", e);
    }
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    setConnectionStatuses(prev => {
        const newState = { ...prev };
        delete newState[deviceId];
        return newState;
    });
  };

  const clearError = () => setError(null);

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="bg-red-500/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
             <BluetoothIcon className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold">Bluetooth Not Supported</h1>
          <p className="text-slate-400">
            Your browser does not support the Web Bluetooth API. Please try using Chrome, Edge, or Bluefy on iOS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BluetoothIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">BleuScan</span>
          </div>
          <div className="flex items-center gap-4">
             {devices.length > 0 && (
                 <Button 
                   onClick={handleScan} 
                   isLoading={isScanning}
                   variant="primary"
                   className="!py-1.5 !px-4 !text-sm"
                   icon={<span className="text-lg leading-none">+</span>}
                 >
                   Add Device
                 </Button>
             )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Header Section (Only show when empty or small list) */}
        {devices.length === 0 && (
          <div className="text-center mb-12 max-w-2xl animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Bluetooth</span> Devices
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Scan and add multiple Bluetooth Low Energy (BLE) devices to your dashboard. Connect, view details, and manage them all in one place.
            </p>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="w-full max-w-md mb-8 animate-fade-in-up sticky top-20 z-20">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3 relative shadow-lg backdrop-blur-sm bg-slate-900/90">
              <span className="mt-0.5 text-lg">⚠️</span>
              <div className="flex-1">
                 <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <button onClick={clearError} className="text-red-400/50 hover:text-red-400 p-1">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Action Area */}
        <div className="w-full flex flex-col items-center gap-8">
          {devices.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-700 rounded-2xl bg-slate-900/30 w-full max-w-md flex flex-col items-center justify-center text-center hover:border-blue-500/50 transition-colors duration-300 group cursor-pointer" onClick={handleScan}>
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-black/20">
                <BluetoothIcon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start Scanning</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-xs">
                Click here to open the browser's device picker and add your first device.
              </p>
              <Button 
                onClick={(e) => { e.stopPropagation(); handleScan(); }}
                isLoading={isScanning}
                icon={<BluetoothIcon className="w-5 h-5" />}
              >
                Scan for Devices
              </Button>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up pb-20">
               {devices.map(device => (
                 <div key={device.id} className="relative h-full">
                   <DeviceInfo 
                     device={device} 
                     isConnected={connectionStatuses[device.id] || false}
                     onDisconnect={() => handleDisconnect(device)}
                     onConnect={() => handleConnect(device)}
                     isConnecting={loadingDevices[device.id] || false}
                   />
                   <button 
                     onClick={() => handleRemoveDevice(device.id)}
                     className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors p-1"
                     title="Remove from list"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                     </svg>
                   </button>
                 </div>
               ))}
               
               {/* Add New Card */}
               <div 
                 onClick={handleScan}
                 className="min-h-[280px] h-full border border-dashed border-slate-700 rounded-2xl bg-slate-900/20 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 hover:border-blue-500/30 transition-all duration-300 cursor-pointer group"
               >
                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-blue-500/20">
                    <span className="text-2xl text-blue-400 group-hover:text-blue-300 transition-colors">+</span>
                 </div>
                 <span className="text-slate-400 font-medium group-hover:text-blue-400 transition-colors">Add Another Device</span>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;