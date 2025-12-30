<?php
/**
 * LinkedIn OAuth Callback Handler for Company Authentication
 * Handles the OAuth flow for company LinkedIn authentication and posts access
 */

// Load environment variables
require_once 'simple-dotenv.php';

// Create dotenv instance and load variables
$dotenv = new SimpleDotenv(__DIR__);
$dotenv->load();

// Enable error reporting for debugging
if (SimpleDotenv::env('LINKEDIN_TEST_MODE') === 'true') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// LinkedIn OAuth Configuration
$client_id = SimpleDotenv::env('LINKEDIN_CLIENT_ID');
$client_secret = SimpleDotenv::env('LINKEDIN_CLIENT_SECRET');
$redirect_uri = SimpleDotenv::env('LINKEDIN_REDIRECT_URI');
$company_id = SimpleDotenv::env('LINKEDIN_COMPANY_ID');

// Start session
session_start();

/**
 * Handle OAuth callback and get access token
 */
function handleOAuthCallback() {
    global $client_id, $client_secret, $redirect_uri;
    
    // Check if we have an authorization code
    if (!isset($_GET['code'])) {
        if (isset($_GET['error'])) {
            return [
                'success' => false,
                'error' => 'OAuth Error: ' . $_GET['error'] . ' - ' . ($_GET['error_description'] ?? 'Unknown error')
            ];
        }
        return [
            'success' => false,
            'error' => 'No authorization code received'
        ];
    }
    
    $auth_code = $_GET['code'];
    
    // Exchange authorization code for access token
    $token_url = 'https://www.linkedin.com/oauth/v2/accessToken';
    
    $post_data = [
        'grant_type' => 'authorization_code',
        'code' => $auth_code,
        'redirect_uri' => $redirect_uri,
        'client_id' => $client_id,
        'client_secret' => $client_secret
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $token_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code !== 200) {
        return [
            'success' => false,
            'error' => 'Failed to get access token. HTTP Code: ' . $http_code,
            'response' => $response
        ];
    }
    
    $token_data = json_decode($response, true);
    
    if (!isset($token_data['access_token'])) {
        return [
            'success' => false,
            'error' => 'No access token in response',
            'response' => $token_data
        ];
    }
    
    // Store the access token in session and .env file
    $_SESSION['linkedin_access_token'] = $token_data['access_token'];
    $_SESSION['linkedin_token_expires'] = time() + ($token_data['expires_in'] ?? 3600);
    
    // Save access token to .env file for permanent storage
    $success = saveAccessTokenToEnv($token_data['access_token']);
    
    // Get user profile and test company access
    $profile = getUserProfile($token_data['access_token']);
    $company_test = testCompanyAccess($token_data['access_token']);
    
    return [
        'success' => true,
        'access_token' => $token_data['access_token'],
        'token_saved' => $success,
        'expires_in' => $token_data['expires_in'] ?? 3600,
        'profile' => $profile,
        'company_access' => $company_test
    ];
}

/**
 * Save access token to .env file
 */
function saveAccessTokenToEnv($access_token) {
    try {
        $env_file = __DIR__ . '/.env';
        $env_content = file_get_contents($env_file);
        
        // Update or add the access token line
        if (strpos($env_content, 'LINKEDIN_ACCESS_TOKEN=') !== false) {
            $env_content = preg_replace(
                '/LINKEDIN_ACCESS_TOKEN=.*/',
                'LINKEDIN_ACCESS_TOKEN=' . $access_token,
                $env_content
            );
        } else {
            $env_content .= "\nLINKEDIN_ACCESS_TOKEN=" . $access_token;
        }
        
        return file_put_contents($env_file, $env_content) !== false;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Get user profile information
 */
function getUserProfile($access_token) {
    // Get profile info for the authenticated user
    $profile_url = 'https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,emailAddress,profilePicture(displayImage~:playableStreams))';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $profile_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $access_token,
        'Content-Type: application/json'
    ]);
    
    $profile_response = curl_exec($ch);
    $profile_http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $profile_data = null;
    if ($profile_http_code === 200) {
        $profile_data = json_decode($profile_response, true);
    }
    
    return $profile_data;
}

/**
 * Test company access with the access token
 */
function testCompanyAccess($access_token) {
    global $company_id;
    
    if (!$company_id || $company_id === 'your_company_page_id_here') {
        return [
            'success' => false,
            'error' => 'Company ID not configured in .env file'
        ];
    }
    
    // Test organization access
    $org_url = 'https://api.linkedin.com/v2/organizations/' . $company_id;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $org_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $access_token,
        'Content-Type: application/json'
    ]);
    
    $org_response = curl_exec($ch);
    $org_http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($org_http_code === 200) {
        $org_data = json_decode($org_response, true);
        return [
            'success' => true,
            'company_name' => $org_data['localizedName'] ?? 'Unknown',
            'company_id' => $company_id
        ];
    } else {
        return [
            'success' => false,
            'error' => 'Cannot access company data. HTTP Code: ' . $org_http_code,
            'response' => $org_response
        ];
    }
}

// Handle the callback
$result = handleOAuthCallback();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LinkedIn Authentication Result</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 50px auto; 
            padding: 20px; 
            line-height: 1.6;
        }
        .success { 
            background: #d4edda; 
            color: #155724; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #c3e6cb;
        }
        .error { 
            background: #f8d7da; 
            color: #721c24; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #f5c6cb;
        }
        .profile-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        pre { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            overflow-x: auto;
            font-size: 14px;
        }
        .back-link {
            display: inline-block;
            margin-top: 20px;
            color: #1976d2;
            text-decoration: none;
            font-weight: 500;
        }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>🏢 LinkedIn Company Authentication Result</h1>
    
    <?php if ($result['success']): ?>
        <div class="success">
            <h2>✅ Company Authentication Successful!</h2>
            <p>You have successfully authenticated with LinkedIn for company access.</p>
            
            <div class="profile-info">
                <h3>🔐 Access Token Information:</h3>
                <p><strong>Status:</strong> Successfully obtained and stored</p>
                <p><strong>Expires in:</strong> <?= $result['expires_in'] ?> seconds (<?= round($result['expires_in'] / 86400, 1) ?> days)</p>
                <p><strong>Saved to .env:</strong> <?= $result['token_saved'] ? '✅ Yes' : '❌ Failed' ?></p>
            </div>
            
            <?php if (isset($result['profile'])): ?>
                <div class="profile-info">
                    <h3>👤 Authenticated User:</h3>
                    <?php 
                    $profile = $result['profile'];
                    if (isset($profile['firstName']['localized'])) {
                        $firstName = reset($profile['firstName']['localized']);
                        $lastName = reset($profile['lastName']['localized']);
                        echo "<p><strong>Name:</strong> {$firstName} {$lastName}</p>";
                    }
                    if (isset($profile['id'])) {
                        echo "<p><strong>LinkedIn ID:</strong> {$profile['id']}</p>";
                    }
                    if (isset($profile['emailAddress'])) {
                        echo "<p><strong>Email:</strong> {$profile['emailAddress']}</p>";
                    }
                    ?>
                </div>
            <?php endif; ?>
            
            <?php if (isset($result['company_access'])): ?>
                <div class="profile-info">
                    <h3>🏢 Company Access Test:</h3>
                    <?php if ($result['company_access']['success']): ?>
                        <p><strong>✅ Company Access:</strong> Granted</p>
                        <p><strong>Company Name:</strong> <?= htmlspecialchars($result['company_access']['company_name']) ?></p>
                        <p><strong>Company ID:</strong> <?= htmlspecialchars($result['company_access']['company_id']) ?></p>
                    <?php else: ?>
                        <p><strong>❌ Company Access:</strong> Failed</p>
                        <p><strong>Error:</strong> <?= htmlspecialchars($result['company_access']['error']) ?></p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <div class="profile-info">
                <h3>🚀 Next Steps:</h3>
                <ul style="text-align: left;">
                    <li>✅ Access token is saved and ready for use</li>
                    <li>🔄 Your website can now fetch real LinkedIn posts</li>
                    <li>📊 Company posts will display automatically</li>
                    <li>🔧 Test the LinkedIn feed on your main website</li>
                </ul>
            </div>
        </div>
        
        <h3>🧪 Test Data (for development):</h3>
        <pre><?= htmlspecialchars(json_encode([
            'access_token_length' => strlen($result['access_token']),
            'expires_in' => $result['expires_in'],
            'profile' => $result['profile'],
            'company_access' => $result['company_access']
        ], JSON_PRETTY_PRINT)) ?></pre>
        
    <?php else: ?>
        <div class="error">
            <h2>❌ Company Authentication Failed</h2>
            <p><strong>Error:</strong> <?= htmlspecialchars($result['error']) ?></p>
            
            <?php if (isset($result['response'])): ?>
                <h3>Response Details:</h3>
                <pre><?= htmlspecialchars(is_string($result['response']) ? $result['response'] : json_encode($result['response'], JSON_PRETTY_PRINT)) ?></pre>
            <?php endif; ?>
            
            <div class="profile-info">
                <h3>🔧 Troubleshooting:</h3>
                <ul style="text-align: left;">
                    <li>Ensure your LinkedIn app has <strong>Marketing Developer Platform</strong> product</li>
                    <li>Verify you have admin access to your company page</li>
                    <li>Check that all required scopes are approved</li>
                    <li>Make sure your LinkedIn app is properly configured</li>
                </ul>
            </div>
        </div>
    <?php endif; ?>
    
    <a href="/" class="back-link">← Back to Website</a>
    
    <script>
        // Auto-close after successful authentication and redirect to main page
        <?php if ($result['success']): ?>
        setTimeout(() => {
            window.location.href = '/';
        }, 5000);
        <?php endif; ?>
    </script>
</body>
</html>