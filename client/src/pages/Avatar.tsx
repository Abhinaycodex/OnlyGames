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
  const [description, setDescription] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setSelectedImageURL(URL.createObjectURL(file));
    setCartoonImage(null); // Reset cartoon image when new file is selected
    setDescription(null);
    setError(null); // Reset error
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setDescription(null);

    try {
      const base64 = await fileToBase64(selectedFile);
      const mimeType = selectedFile.type;
      
      // Use Gemini 2.0 Flash with native image generation
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
                  text: "Generate character of a person whose facial features closely match those of [CHARACTER NAME]. Maintain the character’s unique art style, color palette, and exaggerated expressions, while blending the person’s realistic features naturally into the character blending . Make the image as if the person could belong in the same animated universe as the character",
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
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseModalities: ["TEXT", "IMAGE"]
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
        const parts = data.candidates[0].content.parts;
        
        let textResponse = null;
        let imageData = null;

        // Process all parts to find text and image
        for (const part of parts) {
          if (part.text) {
            textResponse = part.text;
          } else if (part.inlineData) {
            imageData = part.inlineData.data;
          }
        }

        // Set description if we have textResponse
        if (textResponse) {
          setDescription(textResponse);
        }

        // Set cartoon image if we have image data
        if (imageData) {
          const imageUrl = `data:image/png;base64,${imageData}`;
          setCartoonImage(imageUrl);
        } else {
          // Fallback if no image is generated
          throw new Error("No image was generated. The model may not support image generation for this request.");
        }

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

  const handleDownload = () => {
    if (!cartoonImage) return;
    
    const link = document.createElement('a');
    link.href = cartoonImage;
    link.download = `cartoon-${selectedFile?.name?.replace(/\.[^/.]+$/, "") || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          🎨 AI Avatar Cartoonify
        </h1>
        <p className="text-gray-600 text-lg">Transform your photos into stunning cartoon art with AI!</p>
        <p className="text-sm text-gray-500 mt-2">
          Powered by Gemini 2.0 Flash with native image generation
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Upload Section */}
        <div className="flex flex-col items-center gap-6 mb-8">
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
              className={`cursor-pointer px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                } text-white text-lg`}
            >
              📁 Choose Your Photo
            </label>

            {selectedFile && !cartoonImage && (
              <button
                onClick={handleConvert}
                disabled={loading}
                className={`px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  } text-white`}
              >
                {loading ? '⏳ Creating Magic...' : '🎨 Cartoonify!'}
              </button>
            )}
          </div>

          {selectedFile && (
            <p className="text-gray-600 text-sm">
              Selected: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
        </div>

        {/* Image Display Section */}
        {selectedImageURL && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Original Image */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-700 mb-6">📷 Original Photo</h3>
                <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
                  <img
                    src={selectedImageURL}
                    alt="Original"
                    className="w-full h-auto rounded-xl shadow-lg border-4 border-blue-200 transition-transform hover:scale-105"
                  />
                </div>
              </div>

              {/* Cartoon Preview */}
              {(loading || cartoonImage) && (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-700 mb-6">
                    {loading ? '⏳ AI is Working...' : '🎨 Cartoon Result'}
                  </h3>
                  <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
                    {loading ? (
                      <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
                            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-300 opacity-20" />
                          </div>
                          <p className="text-gray-700 font-medium">Generating cartoon magic...</p>
                          <p className="text-gray-500 text-sm mt-1">This may take a few moments</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={cartoonImage!}
                          alt="Cartoon Result"
                          className="w-full h-auto rounded-xl shadow-lg border-4 border-green-200 transition-transform hover:scale-105"
                        />
                        <button
                          onClick={handleDownload}
                          className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
                          title="Download cartoon image"
                        >
                          📥
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description Display */}
        {description && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="font-semibold text-green-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              AI Description:
            </div>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-200">
            <div className="font-semibold text-red-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">❌</span>
              Error:
            </div>
            <p className="text-red-700 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        {(selectedFile || cartoonImage) && (
          <div className="text-center mt-8 space-x-4">
            <button
              onClick={() => {
                setSelectedFile(null);
                setSelectedImageURL(null);
                setCartoonImage(null);
                setDescription(null);
                setError(null);
              }}
              className="px-6 py-3 text-blue-600 hover:text-blue-800 font-semibold transition-colors rounded-lg hover:bg-blue-50"
            >
              🔄 Start Over
            </button>
            
            {cartoonImage && (
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
              >
                📥 Download Cartoon
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="font-bold text-blue-800 mb-4 text-lg">✨ Features:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-lg mr-2">🎨</span>
              <span>Real AI-generated cartoon images</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg mr-2">⚡</span>
              <span>Powered by Gemini 2.0 Flash</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-lg mr-2">📥</span>
              <span>Download high-quality results</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg mr-2">🔄</span>
              <span>Support for all image formats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;