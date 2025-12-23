<?php
// assets/media/fetch_meta.php
// Simple metadata proxy to extract og:title, og:description, og:image or <title>
// Usage: /assets/media/fetch_meta.php?url=https://example.com/page

header('Content-Type: application/json; charset=utf-8');

$url = isset($_GET['url']) ? trim($_GET['url']) : '';
if (!$url) {
    echo json_encode(['ok' => false, 'error' => 'missing_url']);
    exit;
}
if (!preg_match('#^https?://#i', $url)) {
    echo json_encode(['ok' => false, 'error' => 'invalid_scheme']);
    exit;
}

// Basic SSRF protection: block localhost and private IPs (best-effort)
$host = parse_url($url, PHP_URL_HOST);
if (!$host) {
    echo json_encode(['ok' => false, 'error' => 'invalid_url']);
    exit;
}

// Resolve host to IP and block obvious private ranges
$ip = gethostbyname($host);
$private_patterns = [
    '/^10\./', '/^127\./', '/^169\.254\./', '/^172\.(1[6-9]|2[0-9]|3[0-1])\./', '/^192\.168\./', '/^::1$/'
];
foreach ($private_patterns as $pat) {
    if (preg_match($pat, $ip)) {
        echo json_encode(['ok' => false, 'error' => 'blocked_private_ip']);
        exit;
    }
}

// cURL fetch
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
curl_setopt($ch, CURLOPT_USERAGENT, 'CSI-INFINITE-MetaFetcher/1.0 (+https://cybersecuredindia.com)');
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_TIMEOUT, 8);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: text/html,application/xhtml+xml']);
$html = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($html === false || $code >= 400) {
    echo json_encode(['ok' => false, 'error' => 'fetch_failed', 'http_code' => $code, 'curl_error' => $err]);
    exit;
}

// Parse HTML and collect OG / title
libxml_use_internal_errors(true);
$doc = new DOMDocument();
$doc->loadHTML('<?xml encoding="utf-8" ?>' . $html);
libxml_clear_errors();

$metas = $doc->getElementsByTagName('meta');
$metaData = ['title' => '', 'description' => '', 'image' => ''];
for ($i = 0; $i < $metas->length; $i++) {
    $m = $metas->item($i);
    $name = strtolower($m->getAttribute('property') ?: $m->getAttribute('name'));
    $content = trim($m->getAttribute('content'));
    if (!$name || !$content) continue;
    if (in_array($name, ['og:title', 'twitter:title'])) $metaData['title'] = $metaData['title'] ?: $content;
    if (in_array($name, ['og:description', 'twitter:description', 'description'])) $metaData['description'] = $metaData['description'] ?: $content;
    if (in_array($name, ['og:image', 'twitter:image'])) $metaData['image'] = $metaData['image'] ?: $content;
}

// fallback to <title>
if (!$metaData['title']) {
    $titles = $doc->getElementsByTagName('title');
    if ($titles->length) $metaData['title'] = trim($titles->item(0)->textContent);
}

// Normalize relative image URLs
if ($metaData['image']) {
    $img = $metaData['image'];
    if (!preg_match('#^https?://#i', $img)) {
        $scheme = parse_url($url, PHP_URL_SCHEME) ?: 'https';
        $metaData['image'] = rtrim($scheme . '://' . $host, '/') . '/' . ltrim($img, '/');
    }
}

$response = array_merge(['ok' => true, 'source_host' => $host], $metaData);
echo json_encode($response);
exit;
?>
