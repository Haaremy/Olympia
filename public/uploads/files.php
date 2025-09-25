<?php
header('Content-Type: application/json');
// Current folder (same as where files.php is)
$dir = __DIR__;
$files = [];
foreach (scandir($dir) as $file) {
    if (is_file("$dir/$file") && $file !== basename(__FILE__) && preg_ma>
        $files[] = "/uploads/$file"; // leading slash
    }
}
echo json_encode($files, JSON_UNESCAPED_SLASHES);
