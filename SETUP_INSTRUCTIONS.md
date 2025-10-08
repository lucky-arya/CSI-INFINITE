# Setup Instructions for Contact Form (No Composer Required)

## 1. Requirements

- **PHP 7.4 or higher**
- **cURL extension** (for Turnstile verification)
- **Mail function** (or SMTP configuration)
- **Web server** (Apache, Nginx, or PHP built-in server)

No Composer or additional dependencies required!

## 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and fill in your actual values:
   ```env
   # Cloudflare Turnstile Configuration
   TURNSTILE_SECRET=your_actual_secret_key_here
   TURNSTILE_SITE_KEY=your_actual_site_key_here

   # Email Configuration
   TO_EMAIL=your-email@example.com
   FROM_EMAIL=no-reply@yourdomain.com
   SUBJECT_PREFIX=[Contact]
   ```

## 3. Get Cloudflare Turnstile Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Turnstile"
3. Create a new site/widget
4. Choose your domain (use `localhost` for testing)
5. Copy the Site Key and Secret Key to your `.env` file

## 4. Update HTML Site Key

Update the site key in `index.html`:

Find this line:
```html
<div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY_HERE" data-callback="onTurnstileSuccess"></div>
```

Replace `YOUR_SITE_KEY_HERE` with your actual site key from Cloudflare.

## 5. File Structure

```
project/
├── simple-dotenv.php    # Custom environment loader (no Composer!)
├── .env                 # Your environment variables (DO NOT COMMIT)
├── .env.example         # Template for environment variables
├── .gitignore          # Git ignore rules
├── index.html          # Your website
├── script.js           # JavaScript for form handling
├── styles.css          # Your CSS
└── submit-contact.php  # Form processing script
```

## 6. Local Development

### Option 1: PHP Built-in Server
```bash
php -S localhost:8000
```

### Option 2: XAMPP/WAMP/MAMP
- Place files in your web server directory
- Access via http://localhost/your-project/

## 7. Production Deployment

1. Upload all files to your web server
2. Ensure `.env` file has correct production values
3. Update Cloudflare Turnstile domain settings
4. Test form submission

## 8. Security Best Practices

- ✅ **Never commit `.env` file** to version control
- ✅ **Use strong, unique secret keys**
- ✅ **Enable HTTPS in production**
- ✅ **Validate and sanitize all inputs**
- ✅ **Set proper file permissions** (644 for most files, 600 for .env)

## 9. Testing

### Local Testing:
1. Start your local server
2. Navigate to your site
3. Fill out the contact form
4. Check if email is received

### Debug Mode:
Check server error logs if form submission fails.

## 10. Troubleshooting

### Common Issues:

**"Configuration error: .env file not found"**
- Copy `.env.example` to `.env`
- Make sure `.env` file exists in the same directory as `submit-contact.php`

**"Verification failed"**
- Check your `TURNSTILE_SECRET` in `.env`
- Ensure the domain matches your Cloudflare settings

**"Failed to send"**
- Check your email configuration
- Verify PHP mail() function works on your server
- Check server error logs

**"Permission denied"**
- Ensure web server can read the `.env` file
- Check file permissions (644 for `.env`)

**"Class 'SimpleDotenv' not found"**
- Make sure `simple-dotenv.php` is in the same directory as `submit-contact.php`

## 11. How It Works

### Custom Dotenv Loader (`simple-dotenv.php`):
- ✅ **No external dependencies** - pure PHP
- ✅ **Loads .env files** with key=value pairs
- ✅ **Handles comments** (lines starting with #)
- ✅ **Supports quoted values** ("value" or 'value')
- ✅ **Environment variable management**

### Form Processing (`submit-contact.php`):
- ✅ **Uses custom Dotenv loader**
- ✅ **cURL-based Turnstile verification**
- ✅ **Input validation and sanitization**
- ✅ **Simple error handling**
- ✅ **Email sending with proper headers**

## 12. Deployment Checklist

- [ ] Upload all files to web server
- [ ] Create `.env` file with production values
- [ ] Update Cloudflare Turnstile domain settings
- [ ] Update site key in `index.html`
- [ ] Test form submission
- [ ] Verify email delivery
- [ ] Check file permissions

## 13. Optional Enhancements

- **SMTP Email**: Implement SMTP for better email delivery
- **Database Logging**: Store form submissions in a database
- **Rate Limiting**: Add rate limiting to prevent spam
- **HTML Email Templates**: Create better formatted emails

The form is now ready to use without any Composer dependencies!