<?php
/**
 * Simple Dotenv loader - No Composer required
 * Loads environment variables from .env file
 */
class SimpleDotenv {
    private $path;
    
    public function __construct($path) {
        $this->path = $path;
    }
    
    public static function createImmutable($path) {
        return new self($path);
    }
    
    public function load() {
        $envFile = $this->path . '/.env';
        
        if (!file_exists($envFile)) {
            throw new Exception('.env file not found at: ' . $envFile);
        }
        
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            $line = trim($line);
            
            // Skip comments and empty lines
            if (empty($line) || strpos($line, '#') === 0) {
                continue;
            }
            
            // Parse key=value pairs
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if present
                if (preg_match('/^"(.*)"$/', $value, $matches)) {
                    $value = $matches[1];
                } elseif (preg_match('/^\'(.*)\'$/', $value, $matches)) {
                    $value = $matches[1];
                }
                
                // Set environment variable if not already set
                if (!isset($_ENV[$key]) && !isset($_SERVER[$key])) {
                    $_ENV[$key] = $value;
                    $_SERVER[$key] = $value;
                    putenv("$key=$value");
                }
            }
        }
    }
    
    /**
     * Get environment variable value
     */
    public static function env($key, $default = null) {
        return $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key) ?: $default;
    }
}
?>