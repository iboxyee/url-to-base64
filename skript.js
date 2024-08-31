document.getElementById('converter-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const url = document.getElementById('url-input').value;
    if (url) {
        // Encode URL to Base64
        const base64EncodedUrl = btoa(url);
        
        // Display Base64 encoded URL
        document.getElementById('base64-output').value = base64EncodedUrl;
    }
});