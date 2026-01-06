<?php
/**
 * LinkedIn OAuth Authorization Flow - Step 1
 * Redirects user to LinkedIn for authorization
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
$redirectUri = 'http://localhost:8000/linkedin-callback.php'; // Update for production

if (!$clientId) {
    die("LinkedIn Client ID not configured in .env file");
}

// Generate and store CSRF token
$_SESSION['linkedin_csrf_token'] = bin2hex(random_bytes(16));

// LinkedIn OAuth URL
$scope = 'r_liteprofile r_emailaddress w_member_social r_organization_social';
$authUrl = 'https://www.linkedin.com/oauth/v2/authorization?' . http_build_query([
    'response_type' => 'code',
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'state' => $_SESSION['linkedin_csrf_token'],
    'scope' => $scope
]);

?>
<!DOCTYPE html>
<html>
<head>
    <title>LinkedIn OAuth - CyberSecuredIndia</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .auth-container { text-align: center; }
        .linkedin-btn { 
            background: #0077b5; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 4px; 
            display: inline-block; 
            margin: 20px 0;
        }
        .note { background: #f0f8ff; padding: 15px; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="auth-container">
        <h1>🔗 LinkedIn API Authorization</h1>
        <p>To enable real LinkedIn posts on your website, you need to authorize the application.</p>
        
        <div class="note">
            <strong>Note:</strong> This is a one-time setup. After authorization, your website will automatically fetch and display your company's LinkedIn posts.
        </div>
        
        <a href="<?php echo htmlspecialchars($authUrl); ?>" class="linkedin-btn">
            🔗 Authorize with LinkedIn
        </a>
        
        <div class="note">
            <strong>What happens next:</strong><br>
            1. You'll be redirected to LinkedIn to login<br>
            2. Grant permissions to your application<br>
            3. You'll be redirected back with an access token<br>
            4. Your website will start showing real LinkedIn posts!
        </div>
        
        <p><a href="index.html">← Back to Website</a></p>
    </div>
</body>
</html>