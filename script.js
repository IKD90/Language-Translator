// Supported languages (Google Translate API)
const languages = {
    "auto": "Auto Detect",
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "ny": "Chichewa",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "tl": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "he": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "rw": "Kinyarwanda",
    "ko": "Korean",
    "ku": "Kurdish (Kurmanji)",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "or": "Odia",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tg": "Tajik",
    "ta": "Tamil",
    "tt": "Tatar",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "tk": "Turkmen",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "ug": "Uyghur",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
};

// DOM Elements
const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');
const sourceText = document.getElementById('sourceText');
const translatedText = document.getElementById('translatedText');
const translateBtn = document.getElementById('translateBtn');
const swapLangs = document.getElementById('swapLangs');
const voiceInput = document.getElementById('voiceInput');
const speakOutput = document.getElementById('speakOutput');
const copyText = document.getElementById('copyText');
const clearText = document.getElementById('clearText');

// Populate language dropdowns
function populateLanguages() {
    for (const [code, name] of Object.entries(languages)) {
        const option1 = document.createElement('option');
        option1.value = code;
        option1.textContent = name;
        
        const option2 = document.createElement('option');
        option2.value = code;
        option2.textContent = name;
        
        if (code !== 'auto') {
            targetLangSelect.appendChild(option2);
        }
        sourceLangSelect.appendChild(option1);
    }
    
    // Set default languages
    sourceLangSelect.value = 'auto';
    targetLangSelect.value = 'es'; // Spanish
}

// Translate text using Google Translate API (free tier)
async function translateText() {
    const text = sourceText.value.trim();
    if (!text) {
        alert('Please enter text to translate');
        return;
    }

    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;

    try {
        translateBtn.disabled = true;
        translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';

        // Using a free translation API (alternative to Google Translate)
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
        const data = await response.json();

        if (data.responseData) {
            translatedText.value = data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        translatedText.value = 'Error: Could not translate text';
    } finally {
        translateBtn.disabled = false;
        translateBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Translate';
    }
}

// Voice recognition
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = sourceLangSelect.value === 'auto' ? 'en-US' : sourceLangSelect.value;
    recognition.interimResults = false;

    voiceInput.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    voiceInput.style.background = '#f44336';

    recognition.onstart = () => {
        sourceText.placeholder = 'Listening...';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sourceText.value = transcript;
        translateText();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        alert('Error: ' + event.error);
    };

    recognition.onend = () => {
        voiceInput.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceInput.style.background = '#6e8efb';
        sourceText.placeholder = 'Enter text or speak...';
    };

    recognition.start();
}

// Text-to-speech
function speakTranslation() {
    const text = translatedText.value.trim();
    if (!text) {
        alert('No translation to speak');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLangSelect.value;
    speechSynthesis.speak(utterance);
}

// Swap languages
function swapLanguages() {
    const tempLang = sourceLangSelect.value;
    sourceLangSelect.value = targetLangSelect.value;
    targetLangSelect.value = tempLang;

    const tempText = sourceText.value;
    sourceText.value = translatedText.value;
    translatedText.value = tempText;
}

// Copy translated text
function copyTranslatedText() {
    translatedText.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
}

// Clear all text
function clearAllText() {
    sourceText.value = '';
    translatedText.value = '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', populateLanguages);
translateBtn.addEventListener('click', translateText);
swapLangs.addEventListener('click', swapLanguages);
voiceInput.addEventListener('click', startVoiceInput);
speakOutput.addEventListener('click', speakTranslation);
copyText.addEventListener('click', copyTranslatedText);
clearText.addEventListener('click', clearAllText);