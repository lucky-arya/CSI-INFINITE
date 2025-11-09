<?php
// Load custom Dotenv class
require_once 'simple-dotenv.php';

// Load environment variables
try {
    $dotenv = SimpleDotenv::createImmutable(__DIR__);
    $dotenv->load();
} catch (Exception $e) {
    http_response_code(500);
    exit('Configuration error: ' . $e->getMessage());
}

$turnstileSecret = SimpleDotenv::env('TURNSTILE_SECRET', '');
$toEmail         = SimpleDotenv::env('TO_EMAIL', 'you@example.com');
$fromEmail       = SimpleDotenv::env('FROM_EMAIL', 'no-reply@yourdomain.com');
$subjectPrefix   = SimpleDotenv::env('SUBJECT_PREFIX', '[Contact]');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

function sanitize($v) {
    return trim(strip_tags($v ?? ''));
}

$token    = $_POST['cf-turnstile-response'] ?? '';
$name     = sanitize($_POST['full_name'] ?? '');
$emailRaw = trim($_POST['email'] ?? '');
$email    = filter_var($emailRaw, FILTER_VALIDATE_EMAIL);
$category = sanitize($_POST['category'] ?? '');
$phone    = sanitize($_POST['phone'] ?? '');
$subject  = sanitize($_POST['subject'] ?? 'No Subject');
$message  = trim($_POST['message'] ?? '');

$errors = [];
if ($name === '') $errors[] = 'Name required';
if (!$email) $errors[] = 'Valid email required';
if ($category === '') $errors[] = 'Category required';
if ($message === '') $errors[] = 'Message required';
if ($phone && !preg_match('/^[0-9+()\\-\\s]{7,20}$/', $phone)) $errors[] = 'Phone invalid';
if (!$token) $errors[] = 'Verification missing';

if ($errors) {
    http_response_code(400);
    exit('Error: ' . implode('; ', $errors));
}

// Verify Turnstile
$ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'secret'   => $turnstileSecret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ]),
    CURLOPT_TIMEOUT => 10
]);
$resp = curl_exec($ch);
curl_close($ch);

if (!$resp) {
    http_response_code(502);
    exit('Verification service error');
}

$data = json_decode($resp, true);
if (empty($data['success'])) {
    http_response_code(400);
    $codes = isset($data['error-codes']) ? implode(',', $data['error-codes']) : 'unknown';
    exit('Verification failed: ' . $codes);
}

$emailSubject = $subjectPrefix . ' ' . $subject;
$body = "Name: $name\nEmail: $email\nCategory: $category\nPhone: $phone\nIP: " .
        ($_SERVER['REMOTE_ADDR'] ?? 'n/a') . "\n\nMessage:\n$message\n";

$headers = [
    'From: ' . $fromEmail,
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
];

if (!@mail($toEmail, $emailSubject, $body, implode("\r\n", $headers))) {
    http_response_code(500);
    exit('Failed to send');
}

echo 'Success';
?>
