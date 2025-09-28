<?php
header('Content-Type: application/json');

// Ordner mit den Dateien (selbes Verzeichnis wie dieses Script)
$dir = __DIR__;
$files = [];

// Alle Dateien durchgehen
foreach (scandir($dir) as $file) {
    if (
        is_file("$dir/$file") &&
        $file !== basename(__FILE__) &&
        preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)
    ) {
        $files[] = "https://olympia.haaremy.de/uploads/$file"; // relativer Pfad zum Abruf
    }
}

echo json_encode($files, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
