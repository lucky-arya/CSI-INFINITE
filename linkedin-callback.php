<?php
/**
 * LinkedIn OAuth Callback - Step 2
 * Handles the callback from LinkedIn and exchanges code for access token
 */

session_start();
require_once 'simple-dotenv.php';

// Load environment variables
try {
    $dotenv = new SimpleDotenv(__DIR__ . '/.env');
    $dotenv->load();
} catch (Exception $e) {
    die("Error loading .env file: " . $e->getMessage());
}

$clientId = getenv('LINKEDIN_CLIENT_ID');
$clientSecret = getenv('LINKEDIN_CLIENT_SECRET');
$redirectUri = 'http://localhost:8000/linkedin-callback.php'; // Update for production

// Check for errors
if (isset($_GET['error'])) {
    die("Authorization failed: " . htmlspecialchars($_GET['error_description'] ?? $_GET['error']));
}

// Verify CSRF token
if (!isset($_GET['state']) || $_GET['state'] !== $_SESSION['linkedin_csrf_token']) {
    die("Invalid state parameter. Possible CSRF attack.");
}

// Get authorization code
$code = $_GET['code'] ?? null;
if (!$code) {
    die("No authorization code received");
}

// Exchange code for access token
function getAccessToken($clientId, $clientSecret, $redirectUri, $code) {
    $url = 'https://www.linkedin.com/oauth/v2/accessToken';
    
    $data = [
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => $redirectUri,
        'client_id' => $clientId,
        'client_secret' => $clientSecret
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        throw new Exception("Failed to get access token. HTTP: $httpCode, Response: $response");
    }
    
    return json_decode($response, true);
}

try {
    $tokenData = getAccessToken($clientId, $clientSecret, $redirectUri, $code);
    $accessToken = $tokenData['access_token'];
    $expiresIn = $tokenData['expires_in']; // Usually 60 days
    
    // Save token to .env file (or database in production)
    $envContent = file_get_contents('.env');
    $envContent = preg_replace(
        '/LINKEDIN_ACCESS_TOKEN=.*/', 
        'LINKEDIN_ACCESS_TOKEN=' . $accessToken, 
        $envContent
    );
    file_put_contents('.env', $envContent);
    
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>LinkedIn Authorization Success</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { text-align: center; }
            .token-info { background: #f0f8ff; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .btn { background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px; }
        </style>
    </head>
    <body>
        <div class="success">
            <h1>✅ Authorization Successful!</h1>
            <p>Your LinkedIn API access token has been saved successfully.</p>
            
            <div class="token-info">
                <strong>Access Token:</strong> <?php echo substr($accessToken, 0, 20) . '...'; ?><br>
                <strong>Expires In:</strong> <?php echo $expiresIn; ?> seconds (<?php echo round($expiresIn / 86400); ?> days)
            </div>
            
            <p>Your website will now display real LinkedIn posts from your company page!</p>
            
            <a href="index.html" class="btn">🏠 Go to Website</a>
            <a href="test-linkedin-api.php" class="btn">🧪 Test API</a>
        </div>
    </body>
    </html>
    <?php
    
} catch (Exception $e) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>LinkedIn Authorization Error</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { text-align: center; color: #dc3545; }
        </style>
    </head>
    <body>
        <div class="error">
            <h1>❌ Authorization Failed</h1>
            <p><?php echo htmlspecialchars($e->getMessage()); ?></p>
            <p><a href="linkedin-auth.php">Try Again</a> | <a href="index.html">Back to Website</a></p>
        </div>
    </body>
    </html>
    <?php
}
?>