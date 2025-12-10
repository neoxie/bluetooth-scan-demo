import React from 'react';
import { BluetoothDevice } from '../types';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';

interface DeviceInfoProps {
  device: BluetoothDevice;
  isConnected: boolean;
  onDisconnect: () => void;
  onConnect: () => void;
  isConnecting: boolean;
}

export const DeviceInfo: React.FC<DeviceInfoProps> = ({ 
  device, 
  isConnected, 
  onDisconnect,
  onConnect,
  isConnecting
}) => {
  return (
    <div className="w-full bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full min-h-[280px] flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 p-5 border-b border-slate-700 flex justify-between items-start pr-10">
        <div className="overflow-hidden">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 truncate" title={device.name || 'Unknown Device'}>
            {device.name || 'Unknown Device'}
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-mono truncate" title={device.id}>{device.id}</p>
        </div>
        <StatusBadge connected={isConnected} />
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 flex-1">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-slate-400 text-sm">Device Name</span>
            <span className="text-slate-200 font-medium text-sm truncate max-w-[120px]">{device.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-slate-400 text-sm">GATT Support</span>
            <span className="text-slate-200 font-medium text-sm">{device.gatt ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="p-5 pt-0 mt-auto">
          {isConnected ? (
            <Button 
              variant="danger" 
              onClick={onDisconnect}
              className="w-full !py-2 !text-sm"
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={onConnect}
              isLoading={isConnecting}
              className="w-full !py-2 !text-sm"
              disabled={!device.gatt}
            >
              {device.gatt ? 'Connect' : 'Not Supported'}
            </Button>
          )}
      </div>
    </div>
  );
};