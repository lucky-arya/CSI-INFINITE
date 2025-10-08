# Cloudflare Turnstile reCAPTCHA Setup Guide

## 1. Get Cloudflare Turnstile Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Turnstile" (or search for it)
3. Create a new site/widget
4. Choose your domain (or use `localhost` for testing)
5. Copy the **Site Key** and **Secret Key**

## 2. Configure the Keys

### In HTML (index.html):
Replace `YOUR_SITE_KEY_HERE` with your actual Site Key:
```html
<div class="cf-turnstile" data-sitekey="YOUR_ACTUAL_SITE_KEY_HERE" data-callback="onTurnstileSuccess"></div>
```

### In PHP (submit-contact.php):
Replace `YOUR_SECRET_KEY_HERE` with your actual Secret Key:
```php
$TURNSTILE_SECRET_KEY = 'YOUR_ACTUAL_SECRET_KEY_HERE';
```

Also update the recipient email:
```php
$RECIPIENT_EMAIL = 'your-actual-email@domain.com';
```

## 3. Test the Setup

### For Local Testing:
1. Use `localhost` or `127.0.0.1` as your domain in Cloudflare
2. Start a local server (XAMPP, WAMP, or PHP built-in server)
3. Test the form submission

### For Production:
1. Upload files to your web server
2. Update the domain in Cloudflare Turnstile settings
3. Make sure your server supports PHP mail() function or configure SMTP

## 4. Security Notes

- Never expose your Secret Key in client-side code
- Keep the Secret Key in server-side PHP only
- Consider using environment variables for keys in production
- Enable HTTPS in production

## 5. Troubleshooting

### Common Issues:
- **CAPTCHA not loading**: Check if Site Key is correct
- **Verification failing**: Check if Secret Key is correct
- **Email not sending**: Check server mail configuration
- **CORS errors**: Make sure form is submitted to same domain

### Debug Mode:
Uncomment these lines in submit-contact.php for debugging:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

## 6. Features Included

✅ Cloudflare Turnstile reCAPTCHA integration
✅ Server-side validation
✅ Email sending with HTML formatting
✅ Form validation (required fields, email format)
✅ AJAX form submission (no page refresh)
✅ Success/error message display
✅ Automatic form reset on success
✅ Submit button state management
✅ CAPTCHA reset after submission

## 7. Next Steps

1. Get your Cloudflare Turnstile keys
2. Replace the placeholder keys in the files
3. Update the recipient email address
4. Test on your server
5. Deploy to production

For additional security, consider:
- Rate limiting
- IP-based restrictions
- Database logging
- SMTP email instead of PHP mail()