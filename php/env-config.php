<?php
// Load environment variables for client-side use
function loadEnvForClient($filePath) {
    if (!file_exists($filePath)) {
        return [];
    }
    
    $env = [];
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        // Remove quotes if present
        if (preg_match('/^"(.*)"$/', $value, $matches)) {
            $value = $matches[1];
        } elseif (preg_match('/^\'(.*)\'$/', $value, $matches)) {
            $value = $matches[1];
        }
        
        $env[$name] = $value;
    }
    
    return $env;
}

$env = loadEnvForClient(__DIR__ . '/.env');
$TURNSTILE_SITE_KEY = $env['TURNSTILE_SITE_KEY'] ?? 'YOUR_SITE_KEY_HERE';
?>

<script>
// Make site key available to JavaScript
window.TURNSTILE_SITE_KEY = '<?php echo htmlspecialchars($TURNSTILE_SITE_KEY); ?>';
</script>