// API Configuration - API key is stored in GitHub Secrets
const GEMMA_API_KEY = ''; // This will be injected by GitHub Actions

// This will be used to inject the API key
if (typeof window !== 'undefined') {
    window.GEMMA_API_KEY = GEMMA_API_KEY;
}
