export const translations = {
  sk: {
    // Header
    appTitle: 'GeoTIFF do Therion Prevodník',
    appDescription: 'Preveďte geopriestorové výškové dáta (.tif + .tfw) do formátu Therion (.th + .txt) priamo vo vašom prehliadači.',
    // Footer
    footerText: 'Navrhnuté pre jaskyniarov a nadšencov geológie.',
    switchToEN: 'Switch to English',
    // Fix: Add missing translation key to satisfy the TranslationKey type.
    switchToSK: 'Prepnúť na Slovenčinu',
    // File Input
    fileInputTitle: 'Nahrajte súbory .tif a .tfw',
    fileInputPrompt: 'Potiahnite a pustite, alebo kliknite pre nahratie',
    fileInputSelected: 'Súbory vybrané:',
    error_missing_one_file: 'Prosím, nahrajte jeden .tif a jeden .tfw súbor.',
    error_too_many_files: 'Boli vybrané viac ako dva súbory. Prosím, vyberte len jeden .tif a jeden .tfw.',
    error_missing_tif: 'Chýba .tif súbor.',
    error_missing_tfw: 'Chýba .tfw súbor.',
    error_mismatched_names: 'Názvy .tif a .tfw súborov sa nezhodujú.',

    // App states
    parsing: 'Spracovávam súbory...',
    converting: 'Konvertujem...',
    zipping: 'Vytváram .zip...',
    errorPrefix: 'Chyba:',

    // Preview & Settings
    preview_dataInfo: 'Informácie o dátach',
    preview_filename: 'Názov súboru',
    preview_dimensions: 'Rozmery',
    preview_resolution: 'Rozlíšenie',
    preview_minElevation: 'Min. výška',
    preview_maxElevation: 'Max. výška',

    preview_settings: 'Nastavenia Konverzie',
    preview_cs: 'Súradnicový systém',
    preview_resample: 'Faktor prevzorkovania',
    preview_resample_desc: 'Faktor 2 vytvorí z mriežky 1x1m mriežku 2x2m, čím zníži počet bodov o 75%.',
    
    preview_resultingGrid: 'Výsledná mriežka:',
    preview_newDimensions: 'Nové rozmery',
    preview_newResolution: 'Nové rozlíšenie',
    
    convertButton: 'Konvertovať súbory',

    // Results
    result_success: 'Konverzia úspešná!',
    result_description: 'Vaše Therion povrchové súbory sú pripravené na stiahnutie.',
    result_gridInfo: (height: number, width: number) => `Mriežka: ${height} riadkov, ${width} stĺpcov.`,
    result_debugInfo: 'Protokol o spracovaní pre ladenie.',
    downloadButton: (ext: string) => `Stiahnuť ${ext}`,
    downloadAllButton: 'Stiahnuť všetko (.zip)',
    newConversionButton: 'Spustiť novú konverziu',

    // Coordinate Systems
    cs_ijtsk_name: 'S-JTSK (JTSK03, Invertované Y)',
    cs_ijtsk_example: 'Príklad: X: -377168, Y: -1200776',
    cs_jtsk_name: 'S-JTSK (JTSK03)',
    cs_jtsk_example: 'Príklad: X: 377168, Y: 1200776',
    cs_utm33n_name: 'UTM 33N',
    cs_utm33n_example: 'Príklad: X: 582155, Y: 5333156',
    cs_utm34n_name: 'UTM 34N',
    cs_utm34n_example: 'Príklad: X: 339034, Y: 5349764',
    cs_wgs84_name: 'WGS 84 (Lat/Lon)',
    cs_wgs84_example: 'Príklad: Lat: 48.14, Lon: 17.10',
  },
  en: {
    // Header
    appTitle: 'GeoTIFF to Therion Converter',
    appDescription: 'Convert geospatial elevation data (.tif + .tfw) into Therion\'s surface format (.th + .txt) seamlessly in your browser.',
    // Footer
    footerText: 'Designed for cave surveyors and geology enthusiasts.',
    switchToSK: 'Prepnúť na Slovenčinu',
    // Fix: Add missing translation key to satisfy the TranslationKey type.
    switchToEN: 'Switch to English',
    // File Input
    fileInputTitle: 'Upload .tif and .tfw files',
    fileInputPrompt: 'Drag & drop or click to upload',
    fileInputSelected: 'Files selected:',
    error_missing_one_file: 'Please upload one .tif and one .tfw file.',
    error_too_many_files: 'More than two files were selected. Please select only one .tif and one .tfw file.',
    error_missing_tif: 'Missing .tif file.',
    error_missing_tfw: 'Missing .tfw file.',
    error_mismatched_names: 'The .tif and .tfw filenames do not match.',

    // App states
    parsing: 'Parsing files...',
    converting: 'Converting...',
    zipping: 'Creating .zip...',
    errorPrefix: 'Error:',

    // Preview & Settings
    preview_dataInfo: 'Data Information',
    preview_filename: 'Filename',
    preview_dimensions: 'Dimensions',
    preview_resolution: 'Resolution',
    preview_minElevation: 'Min Elevation',
    preview_maxElevation: 'Max Elevation',

    preview_settings: 'Conversion Settings',
    preview_cs: 'Coordinate System',
    preview_resample: 'Resample Factor',
    preview_resample_desc: 'A factor of 2 creates a 2x2m grid from a 1x1m source, reducing points by 75%.',
    
    preview_resultingGrid: 'Resulting Grid:',
    preview_newDimensions: 'New Dimensions',
    preview_newResolution: 'New Resolution',

    convertButton: 'Convert Files',
    
    // Results
    result_success: 'Conversion Successful!',
    result_description: 'Your Therion surface files are ready for download.',
    result_gridInfo: (height: number, width: number) => `Grid: ${height} rows, ${width} columns.`,
    result_debugInfo: 'Process log for debugging.',
    downloadButton: (ext: string) => `Download ${ext}`,
    downloadAllButton: 'Download All (.zip)',
    newConversionButton: 'Start New Conversion',
    
    // Coordinate Systems
    cs_ijtsk_name: 'S-JTSK (JTSK03, Inverted Y)',
    cs_ijtsk_example: 'Example: X: -377168, Y: -1200776',
    cs_jtsk_name: 'S-JTSK (JTSK03)',
    cs_jtsk_example: 'Example: X: 377168, Y: 1200776',
    cs_utm33n_name: 'UTM 33N',
    cs_utm33n_example: 'Example: X: 582155, Y: 5333156',
    cs_utm34n_name: 'UTM 34N',
    cs_utm34n_example: 'Example: X: 339034, Y: 5349764',
    cs_wgs84_name: 'WGS 84 (Lat/Lon)',
    cs_wgs84_example: 'Example: Lat: 48.14, Lon: 17.10',
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.sk & keyof typeof translations.en;