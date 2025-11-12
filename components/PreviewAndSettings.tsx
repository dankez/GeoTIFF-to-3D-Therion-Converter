import React, { useMemo } from 'react';
import { ParsedInfo } from '../types';
import { ConvertIcon, InfoIcon, LoadingSpinner, SettingsIcon } from './Icons';
import { useTranslation } from '../LanguageContext';

interface PreviewAndSettingsProps {
    info: ParsedInfo;
    resampleFactor: number;
    onFactorChange: (factor: number) => void;
    coordinateSystem: string;
    onCoordinateSystemChange: (cs: string) => void;
    onConvert: () => void;
    isConverting: boolean;
}

const InfoItem: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className="font-mono text-gray-200">{value}</span>
    </div>
);

export const PreviewAndSettings: React.FC<PreviewAndSettingsProps> = ({ 
    info, 
    resampleFactor, 
    onFactorChange, 
    coordinateSystem,
    onCoordinateSystemChange,
    onConvert, 
    isConverting 
}) => {
    const { t } = useTranslation();

    const COORDINATE_SYSTEMS = useMemo(() => [
        { id: 'ijtsk', name: t('cs_ijtsk_name'), example: t('cs_ijtsk_example') },
        { id: 'jtsk', name: t('cs_jtsk_name'), example: t('cs_jtsk_example') },
        { id: 'utm33n', name: t('cs_utm33n_name'), example: t('cs_utm33n_example') },
        { id: 'utm34n', name: t('cs_utm34n_name'), example: t('cs_utm34n_example') },
        { id: 'wgs84', name: t('cs_wgs84_name'), example: t('cs_wgs84_example') },
    ], [t]);

    const factor = Math.max(1, Math.floor(resampleFactor));
    const newWidth = Math.floor(info.width / factor);
    const newHeight = Math.floor(info.height / factor);
    const newPixelSizeX = info.pixelSizeX * factor;
    const newPixelSizeY = Math.abs(info.pixelSizeY * factor);

    const selectedSystemInfo = useMemo(() => {
        return COORDINATE_SYSTEMS.find(cs => cs.id === coordinateSystem);
    }, [coordinateSystem, COORDINATE_SYSTEMS]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Information Section */}
                <div className="bg-gray-900/40 p-4 rounded-lg space-y-3">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                        <InfoIcon className="w-5 h-5" />
                        {t('preview_dataInfo')}
                    </h3>
                    <InfoItem label={t('preview_filename')} value={info.filename} />
                    <InfoItem label={t('preview_dimensions')} value={`${info.width} x ${info.height} px`} />
                    <InfoItem label={t('preview_resolution')} value={`${info.pixelSizeX.toFixed(2)} x ${Math.abs(info.pixelSizeY).toFixed(2)} m`} />
                    <InfoItem label={t('preview_minElevation')} value={`${info.minElevation.toFixed(2)} m`} />
                    <InfoItem label={t('preview_maxElevation')} value={`${info.maxElevation.toFixed(2)} m`} />
                </div>
                {/* Resampling Settings Section */}
                 <div className="bg-gray-900/40 p-4 rounded-lg space-y-3 flex flex-col">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5" />
                        {t('preview_settings')}
                    </h3>
                    <div>
                        <label htmlFor="cs-select" className="block text-sm font-medium text-gray-300 mb-2">
                            {t('preview_cs')}
                        </label>
                        <select
                            id="cs-select"
                            value={coordinateSystem}
                            onChange={(e) => onCoordinateSystemChange(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                           {COORDINATE_SYSTEMS.map(cs => (
                               <option key={cs.id} value={cs.id}>{cs.name}</option>
                           ))}
                        </select>
                        {selectedSystemInfo && (
                            <p className="text-xs text-gray-500 mt-2 font-mono">
                                {selectedSystemInfo.example}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="resample-factor" className="block text-sm font-medium text-gray-300 mb-2">
                            {t('preview_resample')}
                        </label>
                        <input 
                            type="number"
                            id="resample-factor"
                            min="1"
                            step="1"
                            value={resampleFactor}
                            onChange={(e) => onFactorChange(parseInt(e.target.value, 10) || 1)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                         <p className="text-xs text-gray-500 mt-2">
                           {t('preview_resample_desc')}
                        </p>
                    </div>
                     <div className="border-t border-gray-700 pt-3 space-y-2 mt-auto">
                         <h4 className="text-sm font-semibold text-gray-400">{t('preview_resultingGrid')}</h4>
                        <InfoItem label={t('preview_newDimensions')} value={`${newWidth} x ${newHeight} px`} />
                        <InfoItem label={t('preview_newResolution')} value={`${newPixelSizeX.toFixed(2)} x ${newPixelSizeY.toFixed(2)} m`} />
                    </div>
                </div>
            </div>
             <div className="flex justify-center pt-4">
                <button
                    onClick={onConvert}
                    disabled={isConverting}
                    className="flex items-center justify-center gap-3 w-full sm:w-auto text-lg font-bold px-8 py-4 rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
                >
                    {isConverting ? (
                        <>
                            <LoadingSpinner />
                            <span>{t('converting')}</span>
                        </>
                    ) : (
                        <>
                            <ConvertIcon />
                            <span>{t('convertButton')}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};