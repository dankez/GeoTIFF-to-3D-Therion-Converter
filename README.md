# GeoTIFF to Therion Converter

A modern, in-browser tool to convert geospatial elevation data (GeoTIFF) into Therion's surface format. This web application allows users to upload a `.tif` image and its corresponding `.tfw` world file to generate the necessary `.th` and `.txt` files for creating surface models in Therion, a software for cave survey data processing.

*Webová aplikácia na konverziu georeferencovaných výškových dát (GeoTIFF) do formátu pre povrch v programe Therion. Umožňuje nahrať súbor `.tif` a príslušný `.tfw` world file pre vygenerovanie `.th` a `.txt` súborov, ktoré sú potrebné na tvorbu modelu povrchu v programe Therion.*

---

## 🚀 Features

### English
*   **✨ 100% Client-Side**: All processing happens in your browser. Files are never uploaded to a server, ensuring data privacy and speed.
*   **📁 Drag & Drop**: A simple and intuitive interface for uploading your `.tif` and `.tfw` files.
*   **🌐 Coordinate System Support**: Select the correct coordinate system for your project, including `S-JTSK`, `UTM`, and `WGS84`.
*   **🔬 Resampling**: Easily reduce the data resolution by setting a resample factor. This is useful for simplifying large datasets.
*   **📊 Instant Preview**: Before converting, view key metadata from your files, such as dimensions, resolution, and the calculated output grid size after resampling.
*   **📦 Direct Downloads**: Instantly download your `.th` file, `.txt` data file, and a detailed `debug.log`.

### Slovenský
*   **✨ 100% v Prehliadači**: Celé spracovanie prebieha vo vašom prehliadači. Súbory sa nikdy nenahrávajú na server, čo zaručuje ochranu dát a rýchlosť.
*   **📁 Potiahni a Pusť**: Jednoduché a intuitívne rozhranie na nahratie vašich `.tif` a `.tfw` súborov.
*   **🌐 Podpora Súradnicových Systémov**: Vyberte si správny súradnicový systém pre váš projekt, vrátane `S-JTSK`, `UTM` a `WGS84`.
*   **🔬 Prevzorkovanie (Resampling)**: Jednoducho znížte rozlíšenie dát nastavením faktora prevzorkovania. Užitočné na zjednodušenie veľkých dátových súborov.
*   **📊 Okamžitý Náhľad**: Pred konverziou si pozrite kľúčové metadáta z vašich súborov, ako sú rozmery, rozlíšenie a vypočítaná veľkosť výstupnej mriežky po prevzorkovaní.
*   **📦 Priame Stiahnutie**: Okamžite si stiahnite váš `.th` súbor, dátový súbor `.txt` a podrobný záznam `debug.log`.

---

## 📖 How to Use

### English
1.  **Upload Files**: Drag and drop your GeoTIFF image (`.tif`) and its corresponding World File (`.tfw`) into the designated areas.
2.  **Adjust Settings**:
    *   Select the correct **Coordinate System** that matches your source data.
    *   (Optional) Set a **Resample Factor** to decrease the grid resolution. For example, a factor of `2` on a 1x1m grid will create a 2x2m grid, reducing the total data points by 75%.
3.  **Convert**: Click the `Convert Files` button.
4.  **Download**: Download the generated `.th`, `.txt`, and `debug.log` files. The `.th` file can be directly used in your Therion project.

### Slovenský
1.  **Nahrajte Súbory**: Potiahnite a pustite váš GeoTIFF obrázok (`.tif`) a príslušný World File (`.tfw`) do určených polí.
2.  **Upravte Nastavenia**:
    *   Vyberte **Súradnicový Systém**, ktorý zodpovedá vašim vstupným dátam.
    *   (Voliteľné) Nastavte **Faktor Prevzorkovania (Resample Factor)** na zníženie rozlíšenia mriežky. Napríklad faktor `2` na mriežke 1x1m vytvorí mriežku 2x2m, čím zníži celkový počet bodov o 75%.
3.  **Konvertovať**: Kliknite na tlačidlo `Convert Files`.
4.  **Stiahnuť**: Stiahnite si vygenerované súbory `.th`, `.txt`, a `debug.log`. Súbor `.th` môžete priamo použiť vo vašom Therion projekte.

---

## 💾 Acquiring Data / Získanie Dát

### English
Digital Terrain Model (DMR 5.0) data for Slovakia can be downloaded from the official [ZBGIS Map Client](https://zbgis.skgeodesy.sk/mapka/sk/teren?pos=48.893945,20.539978,17).

To download data:
1.  Open the [Map Client](https://zbgis.skgeodesy.sk/mapka/sk/teren?pos=48.893945,20.539978,17).
2.  Find the area of interest.
3.  Use the "Export" tool in the sidebar.
4.  Select "Digitálny model reliéfu 5.0 (DMR 5.0)".
5.  Choose your export format (GeoTIFF is recommended) and draw a polygon to select the area.
6.  Download the generated `.tif` and `.tfw` files.

For more information about ZBGIS, the official data source, visit the [GKU website](https://www.gku.sk/gku/produkty-sluzby/zbgis/).

### Slovenský
Digitálny model reliéfu (DMR 5.0) pre územie Slovenska je možné stiahnuť z oficiálneho [Mapového klienta ZBGIS](https://zbgis.skgeodesy.sk/mapka/sk/teren?pos=48.893945,20.539978,17).

Postup pre stiahnutie dát:
1.  Otvorte [Mapového klienta](https://zbgis.skgeodesy.sk/mapka/sk/teren?pos=48.893945,20.539978,17).
2.  Nájdite si záujmové územie.
3.  V bočnom paneli použite nástroj "Export".
4.  Zvoľte vrstvu "Digitálny model reliéfu 5.0 (DMR 5.0)".
5.  Vyberte formát exportu (odporúča sa GeoTIFF) a nakreslite polygón pre výber územia.
6.  Stiahnite vygenerované súbory `.tif` a `.tfw`.

Viac informácií o ZBGIS, oficiálnom zdroji dát, nájdete na [stránke GKÚ](https://www.gku.sk/gku/produkty-sluzby/zbgis/).

---

##  örnek / Example

Here is an example of converting a Slovak Digital Terrain Model (DMR 5.0) dataset.

*Tu je príklad konverzie dát Digitálneho modelu reliéfu (DMR 5.0) zo Slovenska.*

### Input
*   **`dmr5.tif`**: A GeoTIFF file containing elevation data.
*   **`dmr5.tfw`**: The World File with georeferencing info.

**Content of `dmr5.tfw`:**
```
1.0000000000
0.0000000000
0.0000000000
-1.0000000000
-286246.4999006231
-1248451.4998998847
```

### Output
After processing with the coordinate system set to `ijtsk` and a resample factor of `1`, the tool generates the following files:

**1. `dmr5.th`** (for Therion)
```therion
encoding utf-8
surface
  cs ijtsk
  grid -286246.99990062 -1249236.99989988 1.000000000000 1.000000000000 1254 786
  input dmr5.txt
endsurface
```

**2. `dmr5.txt`** (elevation data, snippet)
```
337.862 338.066 338.316 338.5 ...
...
```

**3. `debug.log`** (conversion log, snippet)
```log
--- GeoTIFF to Therion Conversion Log ---
Timestamp: 2025-11-09T09:43:05.853Z

--- 1. INPUT FILES ---
TIFF File: dmr5.tif
TFW File: dmr5.tfw

--- 2. TFW (World File) PARSING ---
Raw Content:
1.0000000000
0.0000000000
0.0000000000
-1.0000000000
-286246.4999006231
-1248451.4998998847

Parsed Values:
  A (pixelSizeX): 1
  D (rotationY): 0
  B (rotationX): 0
  E (pixelSizeY): -1
  C (centerX_ull): -286246.4999006231
  F (centerY_ull): -1248451.4998998847

--- 3. TIFF METADATA ---
Width: 1254 px
Height: 786 px
Min Elevation: 237.940 m
Max Elevation: 396.939 m

--- 4. ORIGIN CALCULATION for Therion `grid` ---
Note: Therion's `grid` command requires the X coordinate of the Upper-Left raster corner
      and the Y coordinate of the Lower-Left raster corner.

[a] Center of Upper-Left Pixel (from TFW):
    X: -286246.4999006231
    Y: -1248451.4998998847

[b] Calculated Upper-Left Corner (ull):
    X = [a].X - (pixelSizeX / 2) = -286246.9999006231
    Y = [a].Y - (pixelSizeY / 2) = -1248450.9998998847

[c] Calculated Lower-Left Corner Y (lll):
    Y = [b].Y + (height * pixelSizeY) = -1249236.9998998847

[d] Final Therion Grid Origin:
    X: -286246.9999006231
    Y: -1249236.9998998847

--- 5. CONVERSION SETTINGS ---
Coordinate System: ijtsk
Resample Factor: 1
  - Original Dimensions: 1254 x 786
  - New Dimensions: 1254 x 786
  - Original Resolution: 1.00 x 1.00
  - New Resolution: 1.00 x 1.00

--- 6. FINAL OUTPUT ---
Generated .th `grid` line:
grid -286246.99990062 -1249236.99989988 1.000000000000 1.000000000000 1254 786
```

---

## 🆚 Alternative: The Old Way (GDAL)

### English
This web tool provides a modern, user-friendly alternative to command-line workflows using tools like GDAL. The manual process, as detailed in this [Slovak Speleological Society blog post](https://blog.sss.sk/2021/02/05/therion-povrch-dmr5-z-portalu-zbgis/), can now be accomplished in seconds without any software installation or terminal commands.

**Advantages of this Web Tool:**
*   **No Installation Required**: Works in any modern browser.
*   **User-Friendly**: A visual interface means no command-line knowledge is needed.
*   **Platform Independent**: Runs on Windows, macOS, Linux, etc.
*   **Secure & Private**: Data is processed locally and never leaves your machine.

### Slovenský
Tento webový nástroj poskytuje modernú a užívateľsky prívetivú alternatívu k postupom využívajúcim príkazový riadok a nástroje ako GDAL. Manuálny proces, podrobne opísaný v [blogovom príspevku Slovenskej speleologickej spoločnosti](https://blog.sss.sk/2021/02/05/therion-povrch-dmr5-z-portalu-zbgis/), je teraz možné uskutočniť za pár sekúnd bez inštalácie softvéru alebo zadávania príkazov do terminálu.

**Výhody tohto webového nástroja:**
*   **Nevyžaduje sa žiadna inštalácia**: Funguje v každom modernom prehliadači.
*   **Užívateľsky Prívetivé**: Vizuálne rozhranie znamená, že nie sú potrebné znalosti príkazového riadku.
*   **Nezávislé od Platformy**: Beží na Windows, macOS, Linux, atď.
*   **Bezpečné a Súkromné**: Dáta sa spracúvajú lokálne a nikdy neopustia váš počítač.
