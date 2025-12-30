<?php
/**
 * LinkedIn API Monitoring Dashboard
 * Check API status, token expiry, and recent posts
 */

require_once 'simple-dotenv.php';

// Load environment variables
try {
    $dotenv = new SimpleDotenv(__DIR__ . '/.env');
    $dotenv->load();
} catch (Exception $e) {
    $envError = $e->getMessage();
}

$accessToken = getenv('LINKEDIN_ACCESS_TOKEN');
$companyId = getenv('LINKEDIN_COMPANY_ID');

?>
<!DOCTYPE html>
<html>
<head>
    <title>LinkedIn API Dashboard - CyberSecuredIndia</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status-good { color: #28a745; }
        .status-warning { color: #ffc107; }
        .status-error { color: #dc3545; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; margin: 5px; }
        .btn-primary { background: #0077b5; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .code { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; margin: 10px 0; }
        .posts-preview { max-height: 300px; overflow-y: auto; }
        .post-item { border-bottom: 1px solid #eee; padding: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔗 LinkedIn API Dashboard</h1>
            <p>Monitor your LinkedIn integration status</p>
        </div>

        <div class="grid">
            <!-- Configuration Status -->
            <div class="card">
                <h3>⚙️ Configuration Status</h3>
                <?php
                $clientId = getenv('LINKEDIN_CLIENT_ID');
                $clientSecret = getenv('LINKEDIN_CLIENT_SECRET');
                
                echo "<p>Client ID: " . ($clientId ? "<span class='status-good'>✓ Configured</span>" : "<span class='status-error'>✗ Missing</span>") . "</p>";
                echo "<p>Client Secret: " . ($clientSecret ? "<span class='status-good'>✓ Configured</span>" : "<span class='status-error'>✗ Missing</span>") . "</p>";
                echo "<p>Company ID: " . ($companyId ? "<span class='status-good'>✓ Configured ($companyId)</span>" : "<span class='status-error'>✗ Missing</span>") . "</p>";
                echo "<p>Access Token: " . ($accessToken ? "<span class='status-good'>✓ Configured</span>" : "<span class='status-error'>✗ Missing</span>") . "</p>";
                
                if (isset($envError)) {
                    echo "<p class='status-error'>⚠️ .env file error: $envError</p>";
                }
                ?>
            </div>

            <!-- API Status -->
            <div class="card">
                <h3>🌐 API Status</h3>
                <div id="api-status">Checking...</div>
                <button onclick="checkAPI()" class="btn btn-primary">🔄 Refresh Status</button>
            </div>

            <!-- Quick Actions -->
            <div class="card">
                <h3>🚀 Quick Actions</h3>
                <?php if (!$accessToken): ?>
                    <a href="linkedin-auth.php" class="btn btn-primary">🔗 Authorize LinkedIn</a>
                <?php endif; ?>
                <a href="test-linkedin-api.php" class="btn btn-success">🧪 Test API</a>
                <a href="linkedin-feed.php" class="btn btn-primary">📡 View Feed JSON</a>
                <a href="index.html" class="btn btn-success">🏠 Back to Website</a>
            </div>

            <!-- Recent Posts Preview -->
            <div class="card">
                <h3>📝 Recent Posts Preview</h3>
                <div id="posts-preview" class="posts-preview">Loading...</div>
                <button onclick="loadPosts()" class="btn btn-primary">🔄 Refresh Posts</button>
            </div>
        </div>

        <!-- Instructions -->
        <div class="card">
            <h3>📋 Next Steps</h3>
            <ol>
                <?php if (!$accessToken): ?>
                    <li><strong>Get Access Token:</strong> Click "Authorize LinkedIn" above to get your access token</li>
                <?php endif; ?>
                <li><strong>Test API:</strong> Use the "Test API" button to verify your connection</li>
                <li><strong>Check Website:</strong> Visit your main website to see LinkedIn posts in action</li>
                <li><strong>Monitor:</strong> Use this dashboard to monitor API health</li>
            </ol>
        </div>
    </div>

    <script>
        async function checkAPI() {
            const statusDiv = document.getElementById('api-status');
            statusDiv.innerHTML = '⏳ Checking API status...';
            
            try {
                const response = await fetch('linkedin-feed.php');
                const data = await response.json();
                
                if (data.success) {
                    statusDiv.innerHTML = `
                        <p class="status-good">✅ API Working</p>
                        <p>Posts loaded: ${data.data.length}</p>
                        <p>Last updated: ${new Date(data.timestamp * 1000).toLocaleString()}</p>
                    `;
                } else {
                    statusDiv.innerHTML = `<p class="status-error">❌ API Error: ${data.error}</p>`;
                }
            } catch (error) {
                statusDiv.innerHTML = `<p class="status-error">❌ Connection Error: ${error.message}</p>`;
            }
        }

        async function loadPosts() {
            const postsDiv = document.getElementById('posts-preview');
            postsDiv.innerHTML = '⏳ Loading posts...';
            
            try {
                const response = await fetch('linkedin-feed.php');
                const data = await response.json();
                
                if (data.success && data.data.length > 0) {
                    postsDiv.innerHTML = data.data.map(post => `
                        <div class="post-item">
                            <strong>${post.author.name}</strong> - ${post.createdTime}<br>
                            <small>${post.text.substring(0, 100)}...</small><br>
                            <small>👍 ${post.engagement.likes} | 💬 ${post.engagement.comments} | 🔄 ${post.engagement.shares}</small>
                        </div>
                    `).join('');
                } else {
                    postsDiv.innerHTML = '<p>No posts available</p>';
                }
            } catch (error) {
                postsDiv.innerHTML = `<p class="status-error">Error loading posts: ${error.message}</p>`;
            }
        }

        // Auto-load on page load
        checkAPI();
        loadPosts();
    </script>
</body>
</html>