// API Configuration - Add your key here
const GEMMA_API_KEY = 'AIzaSyA6cdSKkXZi8QPzixkJJQpxlk27beWh09E';

// This will be used to inject the API key
if (typeof window !== 'undefined') {
    window.GEMMA_API_KEY = GEMMA_API_KEY;
}
