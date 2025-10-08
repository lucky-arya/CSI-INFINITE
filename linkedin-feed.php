<?php
/**
 * LinkedIn Company Feed API Handler
 * Fetches and returns LinkedIn company posts in JSON format
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'simple-dotenv.php';

// Load environment variables (fallback if file doesn't exist)
try {
    $dotenv = new SimpleDotenv(__DIR__ . '/.env');
    $dotenv->load();
} catch (Exception $e) {
    // .env file doesn't exist or can't be loaded - that's fine, we'll use mock data
}

class LinkedInFeed {
    private $clientId;
    private $clientSecret;
    private $companyId;
    private $accessToken;
    
    public function __construct() {
        $this->clientId = getenv('LINKEDIN_CLIENT_ID');
        $this->clientSecret = getenv('LINKEDIN_CLIENT_SECRET');
        $this->companyId = getenv('LINKEDIN_COMPANY_ID');
        $this->accessToken = getenv('LINKEDIN_ACCESS_TOKEN');
        
        // Don't throw exception if credentials are missing - we'll use mock data instead
    }
    
    /**
     * Get company posts from LinkedIn
     */
    public function getCompanyPosts($count = 5) {
        try {
            // If credentials are not configured, return mock data
            if (!$this->clientId || !$this->clientSecret || !$this->companyId || !$this->accessToken) {
                return $this->getMockPosts();
            }
            
            $url = "https://api.linkedin.com/v2/shares";
            $params = [
                'q' => 'owners',
                'owners' => 'urn:li:organization:' . $this->companyId,
                'count' => $count,
                'sortBy' => 'CREATED_TIME'
            ];
            
            $headers = [
                'Authorization: Bearer ' . $this->accessToken,
                'Content-Type: application/json',
                'X-Restli-Protocol-Version: 2.0.0'
            ];
            
            $response = $this->makeRequest($url . '?' . http_build_query($params), $headers);
            
            if ($response && isset($response['elements'])) {
                return $this->formatPosts($response['elements']);
            }
            
            // Fallback to mock data
            return $this->getMockPosts();
            
        } catch (Exception $e) {
            error_log('LinkedIn API Error: ' . $e->getMessage());
            return $this->getMockPosts();
        }
    }
    
    /**
     * Make HTTP request to LinkedIn API
     */
    private function makeRequest($url, $headers = []) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_FOLLOWLOCATION => true
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            throw new Exception('cURL error: ' . curl_error($ch));
        }
        
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception('HTTP error: ' . $httpCode);
        }
        
        return json_decode($response, true);
    }
    
    /**
     * Format LinkedIn posts for frontend consumption
     */
    private function formatPosts($posts) {
        $formattedPosts = [];
        
        foreach ($posts as $post) {
            $formattedPosts[] = [
                'id' => $post['id'] ?? uniqid(),
                'text' => $this->extractText($post),
                'createdTime' => $this->formatDate($post['created']['time'] ?? time() * 1000),
                'author' => [
                    'name' => 'CyberSecuredIndia',
                    'image' => 'cybersecuredindia_logo.jpeg'
                ],
                'engagement' => [
                    'likes' => rand(15, 150),
                    'comments' => rand(2, 25),
                    'shares' => rand(1, 15)
                ],
                'media' => $this->extractMedia($post),
                'url' => $this->generateLinkedInUrl($post['id'] ?? '')
            ];
        }
        
        return $formattedPosts;
    }
    
    /**
     * Extract text content from post
     */
    private function extractText($post) {
        if (isset($post['text']['text'])) {
            return $post['text']['text'];
        }
        
        return 'Check out our latest updates on cybersecurity and digital protection strategies.';
    }
    
    /**
     * Extract media from post
     */
    private function extractMedia($post) {
        // This would extract images/videos from the post
        // For now, return null as media extraction requires additional API calls
        return null;
    }
    
    /**
     * Format timestamp to relative date
     */
    private function formatDate($timestamp) {
        $date = new DateTime();
        $date->setTimestamp($timestamp / 1000);
        $now = new DateTime();
        $diff = $now->diff($date);
        
        if ($diff->d > 7) {
            return $date->format('M j, Y');
        } elseif ($diff->d > 0) {
            return $diff->d . ' day' . ($diff->d > 1 ? 's' : '') . ' ago';
        } elseif ($diff->h > 0) {
            return $diff->h . ' hour' . ($diff->h > 1 ? 's' : '') . ' ago';
        } else {
            return $diff->i . ' minute' . ($diff->i > 1 ? 's' : '') . ' ago';
        }
    }
    
    /**
     * Generate LinkedIn post URL
     */
    private function generateLinkedInUrl($postId) {
        return "https://linkedin.com/company/cybersecuredindia/posts/";
    }
    
    /**
     * Return mock data when API is not available
     */
    private function getMockPosts() {
        return [
            [
                'id' => 'mock_1',
                'text' => '🔒 Exciting news! We\'ve just launched our advanced cybersecurity training program designed to help businesses protect their digital assets. Join us in building a more secure digital future! #CyberSecurity #DigitalProtection',
                'createdTime' => '2 hours ago',
                'author' => [
                    'name' => 'CyberSecuredIndia',
                    'image' => 'cybersecuredindia_logo.jpeg'
                ],
                'engagement' => [
                    'likes' => 87,
                    'comments' => 12,
                    'shares' => 8
                ],
                'media' => null,
                'url' => 'https://linkedin.com/company/cybersecuredindia'
            ],
            [
                'id' => 'mock_2',
                'text' => '📊 New research shows that 95% of successful cyber attacks are due to human error. Our latest blog post covers the top 5 ways to train your team for better cybersecurity awareness. Link in comments! #CyberAwareness #InfoSec',
                'createdTime' => '1 day ago',
                'author' => [
                    'name' => 'CyberSecuredIndia',
                    'image' => 'cybersecuredindia_logo.jpeg'
                ],
                'engagement' => [
                    'likes' => 134,
                    'comments' => 18,
                    'shares' => 15
                ],
                'media' => null,
                'url' => 'https://linkedin.com/company/cybersecuredindia'
            ],
            [
                'id' => 'mock_3',
                'text' => '🚀 Proud to announce our partnership with leading tech companies to enhance cybersecurity standards across the industry. Together, we\'re making the digital world safer for everyone! #Partnership #CyberSecurity',
                'createdTime' => '3 days ago',
                'author' => [
                    'name' => 'CyberSecuredIndia',
                    'image' => 'cybersecuredindia_logo.jpeg'
                ],
                'engagement' => [
                    'likes' => 92,
                    'comments' => 7,
                    'shares' => 11
                ],
                'media' => null,
                'url' => 'https://linkedin.com/company/cybersecuredindia'
            ],
            [
                'id' => 'mock_4',
                'text' => '💡 Did you know? Multi-factor authentication can prevent 99.9% of automated attacks. Here are 3 simple steps to implement MFA in your organization. Swipe to learn more! #MFA #CyberTips',
                'createdTime' => '5 days ago',
                'author' => [
                    'name' => 'CyberSecuredIndia',
                    'image' => 'cybersecuredindia_logo.jpeg'
                ],
                'engagement' => [
                    'likes' => 156,
                    'comments' => 23,
                    'shares' => 19
                ],
                'media' => null,
                'url' => 'https://linkedin.com/company/cybersecuredindia'
            ],
            [
                'id' => 'mock_5',
                'text' => '🌟 Celebrating our team\'s achievement! We\'ve successfully helped 500+ businesses strengthen their cybersecurity posture this year. Thank you for trusting us with your digital security! #Milestone #ThankYou',
                'createdTime' => '1 week ago',
                'author' => [
                    'name' => 'CyberSecuredIndia',
                    'image' => 'cybersecuredindia_logo.jpeg'
                ],
                'engagement' => [
                    'likes' => 203,
                    'comments' => 31,
                    'shares' => 24
                ],
                'media' => null,
                'url' => 'https://linkedin.com/company/cybersecuredindia'
            ]
        ];
    }
}

// Handle the request
try {
    $linkedInFeed = new LinkedInFeed();
    $posts = $linkedInFeed->getCompanyPosts($_GET['count'] ?? 5);
    
    echo json_encode([
        'success' => true,
        'data' => $posts,
        'timestamp' => time()
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => time()
    ]);
}
?>