<?php
/**
 * LinkedIn API Test Script
 * Use this to test your LinkedIn API credentials and connection
 */

require_once 'simple-dotenv.php';

// Load environment variables
try {
    $dotenv = new SimpleDotenv(__DIR__ . '/.env');
    $dotenv->load();
} catch (Exception $e) {
    echo "Error loading .env file: " . $e->getMessage() . "\n";
    exit(1);
}

// Get LinkedIn credentials
$clientId = getenv('LINKEDIN_CLIENT_ID');
$clientSecret = getenv('LINKEDIN_CLIENT_SECRET');
$companyId = getenv('LINKEDIN_COMPANY_ID');
$accessToken = getenv('LINKEDIN_ACCESS_TOKEN');

echo "=== LinkedIn API Configuration Test ===\n\n";

// Check credentials
echo "1. Checking credentials...\n";
echo "   Client ID: " . ($clientId ? "✓ Configured" : "✗ Missing") . "\n";
echo "   Client Secret: " . ($clientSecret ? "✓ Configured" : "✗ Missing") . "\n";
echo "   Company ID: " . ($companyId ? "✓ Configured ($companyId)" : "✗ Missing") . "\n";
echo "   Access Token: " . ($accessToken ? "✓ Configured" : "✗ Missing") . "\n\n";

if (!$accessToken) {
    echo "❌ Access Token is required to fetch posts. Please follow the OAuth flow first.\n";
    echo "💡 For now, the system will use mock data.\n";
    exit(0);
}

// Test API connection
echo "2. Testing LinkedIn API connection...\n";

function testLinkedInAPI($accessToken, $companyId) {
    // Test with profile API first (simpler)
    $url = "https://api.linkedin.com/v2/people/~:(id,firstName,lastName)";
    
    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
        'X-Restli-Protocol-Version: 2.0.0'
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    echo "   HTTP Status: $httpCode\n";
    
    if ($error) {
        echo "   ❌ cURL Error: $error\n";
        return false;
    }
    
    if ($httpCode === 200) {
        echo "   ✓ API Connection Successful!\n";
        $data = json_decode($response, true);
        if (isset($data['firstName'])) {
            echo "   ✓ Authenticated as: " . $data['firstName']['localized']['en_US'] . " " . $data['lastName']['localized']['en_US'] . "\n";
        }
        return true;
    } else {
        echo "   ❌ API Error: $httpCode\n";
        echo "   Response: $response\n";
        return false;
    }
}

if (testLinkedInAPI($accessToken, $companyId)) {
    echo "\n3. Testing company posts API...\n";
    
    // Test company posts
    $url = "https://api.linkedin.com/v2/shares";
    $params = [
        'q' => 'owners',
        'owners' => 'urn:li:organization:' . $companyId,
        'count' => 3
    ];
    
    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
        'X-Restli-Protocol-Version: 2.0.0'
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url . '?' . http_build_query($params),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "   Company Posts API Status: $httpCode\n";
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $postCount = isset($data['elements']) ? count($data['elements']) : 0;
        echo "   ✓ Successfully fetched $postCount posts!\n";
        
        if ($postCount > 0) {
            echo "   📝 Sample post text: " . substr($data['elements'][0]['text']['text'] ?? 'No text', 0, 100) . "...\n";
        }
    } else {
        echo "   ❌ Company Posts Error: $httpCode\n";
        echo "   Response: $response\n";
    }
}

echo "\n=== Test Complete ===\n";
echo "💡 Once your API is working, the website will automatically use real data instead of mock posts.\n";
?>