# LinkedIn API Integration Setup Guide

## Step 1: Create LinkedIn Developer Application

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Sign in with your LinkedIn account
3. Click "Create App"
4. Fill in application details:
   - **App name**: CyberSecuredIndia Website
   - **LinkedIn Page**: Your company LinkedIn page
   - **Privacy policy URL**: https://yourdomain.com/privacy-policy
   - **App logo**: Upload your CSI logo (cybersecuredindia_logo.jpeg)

## Step 2: Configure App Permissions

1. In your LinkedIn app dashboard, go to "Products" tab
2. Request access to:
   - **Marketing Developer Platform** (for company posts)
   - **Sign In with LinkedIn using OpenID Connect** (for profile access)

3. Add authorized redirect URLs:
   - `https://yourdomain.com/linkedin-callback.php`
   - `http://localhost:8000/linkedin-callback.php` (for testing)

## Step 3: Get API Credentials

1. Go to "Auth" tab in your LinkedIn app
2. Copy the following values:
   - **Client ID**
   - **Client Secret**

## Step 4: Get Company Page ID

1. Go to your LinkedIn company page
2. Look at the URL: `https://www.linkedin.com/company/YOUR_COMPANY_NAME/`
3. The company ID can also be found using LinkedIn's Company Lookup API

## Step 5: Configure Environment Variables

Update your `.env` file with the following:

```env
# LinkedIn API Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
LINKEDIN_COMPANY_ID=your_linkedin_company_page_id
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
```

## Step 6: Generate Access Token

For company posts, you'll need to:

1. Implement OAuth 2.0 flow to get user authorization
2. Exchange authorization code for access token
3. Use the access token to fetch company posts

### Quick OAuth Implementation:

Create `linkedin-auth.php`:

```php
<?php
session_start();
require_once 'simple-dotenv.php';

$dotenv = new SimpleDotenv(__DIR__ . '/.env');
$dotenv->load();

$client_id = getenv('LINKEDIN_CLIENT_ID');
$redirect_uri = getenv('LINKEDIN_REDIRECT_URI');
$scope = 'r_organization_social w_organization_social';

$auth_url = "https://www.linkedin.com/oauth/v2/authorization?" . http_build_query([
    'response_type' => 'code',
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri,
    'scope' => $scope,
    'state' => $_SESSION['csrf_token'] = bin2hex(random_bytes(16))
]);

header("Location: " . $auth_url);
exit;
?>
```

## Step 7: Current Implementation

The current implementation in `linkedin-feed.php` includes:
- ✅ Mock data for immediate testing
- ✅ Error handling and fallback
- ✅ Proper JSON response format
- ✅ Rate limiting considerations

## Step 8: Testing

1. The LinkedIn feed section will load mock data by default
2. Once you configure the actual API credentials, replace the mock data logic
3. Test with: `http://localhost:8000/linkedin-feed.php`

## API Rate Limits

LinkedIn API has the following limits:
- **Marketing API**: 500 requests per day per app
- **Profile API**: 500 requests per day per person

## Security Notes

- Never commit API credentials to version control
- Use HTTPS in production
- Implement proper error handling
- Cache API responses to reduce requests

## Troubleshooting

1. **"Invalid credentials"**: Check your Client ID and Secret
2. **"Access denied"**: Ensure your app has proper permissions
3. **"Rate limit exceeded"**: Implement caching and reduce request frequency

## Production Deployment

1. Update redirect URLs to production domain
2. Set up proper SSL certificates
3. Configure environment variables on your server
4. Implement access token refresh logic
5. Set up monitoring for API failures
