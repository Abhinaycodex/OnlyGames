import { useState } from 'react';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result) reject("Failed to read file");
      // Remove the data URL prefix to get just the base64 string
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const Avatar = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageURL, setSelectedImageURL] = useState<string | null>(null);
  const [cartoonImage, setCartoonImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setSelectedImageURL(URL.createObjectURL(file));
    setCartoonImage(null); // Reset cartoon image when new file is selected
    setError(null); // Reset error
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(selectedFile);
      const mimeType = selectedFile.type;
      
      // Correct Gemini API endpoint and request format
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY 
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "convert into black and white cartoon style",
                },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log("Gemini response:", data);

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const textResponse = data.candidates[0].content.parts[0].text;
        console.log("Generated description:", textResponse);
        
        // Since Gemini can't actually generate images, we'll create a placeholder
        // In a real implementation, you'd need an image generation service
        const placeholderDataUrl = `data:image/svg+xml,${encodeURIComponent(`
          <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#4ecdc4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#45b7d1;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" fill="url(#bg)"/>
            <circle cx="256" cy="200" r="80" fill="#fff" opacity="0.9"/>
            <circle cx="230" cy="180" r="12" fill="#333"/>
            <circle cx="282" cy="180" r="12" fill="#333"/>
            <path d="M 220 220 Q 256 250 292 220" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round"/>
            <text x="256" y="350" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">
              Cartoon Generated!
            </text>
            <text x="256" y="380" font-family="Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle" opacity="0.8">
              (Placeholder - see description below)
            </text>
          </svg>
        `)}`;

        setCartoonImage(placeholderDataUrl);
        
        // Show the description in a more user-friendly way
        setError(`✨ Cartoon Description: ${textResponse}`);
      } else {
        throw new Error("No valid response from Gemini API");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError(`Failed to process image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎨 Avatar Cartoonify</h1>
        <p className="text-gray-600">Upload an image to get a cartoon description and preview!</p>
        <p className="text-sm text-gray-500 mt-2">
          Note: This demo uses Gemini to describe how your image would look as a cartoon
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Upload Section */}
        <div className="flex flex-col items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              onChange={handleImageUpload}
              disabled={loading}
            />
            <label
              htmlFor="avatar-upload"
              className={`cursor-pointer px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg'
                } text-white`}
            >
              📁 Choose Image
            </label>

            {selectedFile && !cartoonImage && (
              <button
                onClick={handleConvert}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg'
                  } text-white`}
              >
                {loading ? '⏳ Processing...' : '🎨 Cartoonify!'}
              </button>
            )}
          </div>
        </div>

        {/* Image Display Section */}
        {selectedImageURL && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Original Image */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">📷 Original</h3>
                <div className="relative mx-auto" style={{ maxWidth: '300px' }}>
                  <img
                    src={selectedImageURL}
                    alt="Original"
                    className="w-full h-auto rounded-lg shadow-md border-4 border-blue-200"
                  />
                </div>
              </div>

              {/* Cartoon Preview */}
              {(loading || cartoonImage) && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    {loading ? '⏳ Creating Cartoon...' : '🎨 Cartoon Preview'}
                  </h3>
                  <div className="relative mx-auto" style={{ maxWidth: '300px' }}>
                    {loading ? (
                      <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
                          <p className="text-gray-600">Processing with AI...</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={cartoonImage!}
                        alt="Cartoon Preview"
                        className="w-full h-auto rounded-lg shadow-md border-4 border-green-200"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error/Description Display */}
        {error && (
          <div className={`mt-4 p-4 rounded-lg ${
            error.startsWith('✨') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="font-medium mb-2">
              {error.startsWith('✨') ? '🎨 AI Description:' : '❌ Error:'}
            </div>
            <p className="text-sm leading-relaxed">{error.replace('✨ Cartoon Description: ', '')}</p>
          </div>
        )}

        {/* Reset Button */}
        {(selectedFile || cartoonImage) && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setSelectedFile(null);
                setSelectedImageURL(null);
                setCartoonImage(null);
                setError(null);
              }}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              🔄 Start Over
            </button>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 How it works:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Upload any image (PNG, JPG, etc.)</li>
          <li>• AI analyzes your image and describes how it would look as a cartoon</li>
          <li>• Get a preview placeholder with the detailed description</li>
          <li>• For actual image generation, you'd need a service like DALL-E, Midjourney, or Stable Diffusion</li>
        </ul>
      </div>
    </div>
  );
};

export default Avatar;