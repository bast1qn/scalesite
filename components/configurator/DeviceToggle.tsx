// ============================================
// DEVICE TOGGLE
// Switch between desktop, tablet, and mobile preview
// ============================================

import { motion } from '@/lib/motion';
import type { DeviceType } from './Configurator';

interface DeviceToggleProps {
    selectedDevice: DeviceType;
    onSelect: (device: DeviceType) => void;
    readOnly?: boolean;
}

interface DeviceOption {
    id: DeviceType;
    label: string;
    icon: React.ReactNode;
    width: string;
}

export const DeviceToggle = ({
    selectedDevice,
    onSelect,
    readOnly = false
}: DeviceToggleProps) => {
    const devices: DeviceOption[] = [
        {
            id: 'desktop',
            label: 'Desktop',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            width: '100%'
        },
        {
            id: 'tablet',
            label: 'Tablet',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            width: '768px'
        },
        {
            id: 'mobile',
            label: 'Mobile',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            width: '375px'
        }
    ];

    return (
        <div className="space-y-4">
            {/* Device Toggle Buttons */}
            <div className="flex gap-2 p-1 bg-light-bg dark:bg-dark-bg rounded-lg">
                {devices.map((device) => {
                    const isSelected = selectedDevice === device.id;

                    return (
                        <motion.button
                            key={device.id}
                            onClick={() => !readOnly && onSelect(device.id)}
                            disabled={readOnly}
                            whileHover={{ scale: readOnly ? 1 : 1.05 }}
                            whileTap={{ scale: readOnly ? 1 : 0.95 }}
                            className={`flex-1 flex flex-col items-center gap-2 py-3 px-4 rounded-md transition-all min-h-11 ${
                                isSelected
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-dark-text/60 dark:text-light-text/60 hover:text-dark-text dark:hover:text-light-text hover:bg-dark-text/5 dark:hover:bg-light-text/5'
                            } ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} focus:ring-2 focus:ring-primary-500/50`}
                        >
                            {device.icon}
                            <span className="text-xs font-medium">
                                {device.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Device Info */}
            <motion.div
                key={selectedDevice}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-light-bg dark:bg-dark-bg rounded-lg"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {devices.find(d => d.id === selectedDevice)?.icon}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-dark-text dark:text-light-text">
                            {devices.find(d => d.id === selectedDevice)?.label} Ansicht
                        </div>
                        <div className="text-xs text-dark-text/50 dark:text-light-text/50">
                            {devices.find(d => d.id === selectedDevice)?.width}
                        </div>
                    </div>
                </div>

                {/* Responsive Indicator */}
                <div className="text-right">
                    <div className="text-xs text-dark-text/60 dark:text-light-text/60">
                        {selectedDevice === 'desktop' && '🖥️ Full Width'}
                        {selectedDevice === 'tablet' && '📱 768px'}
                        {selectedDevice === 'mobile' && '📱 375px'}
                    </div>
                </div>
            </motion.div>

            {/* Device Breakpoints Info */}
            <div className="p-3 bg-surface dark:bg-dark-surface rounded-lg border border-dark-text/10 dark:border-light-text/10">
                <h4 className="text-xs font-semibold text-dark-text dark:text-light-text mb-2">
                    Responsive Breakpoints
                </h4>
                <div className="space-y-1 text-xs text-dark-text/60 dark:text-light-text/60">
                    <div className="flex justify-between">
                        <span>Desktop</span>
                        <span className="font-mono">≥ 1024px</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tablet</span>
                        <span className="font-mono">768px - 1023px</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Mobile</span>
                        <span className="font-mono">&lt; 768px</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
