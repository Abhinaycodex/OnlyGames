import { useState } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result) reject("Failed to read file");
      resolve(reader.result as string); // this includes the `data:image/png;base64,...` prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file); // this gives the correct format
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
  };

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleConvert = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(selectedFile);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "image/png",
            data: base64.split(",")[1],
          },
        },
        "Cartoonify this image and describe the output in detail.",
      ]);

      const response = await result.response;
      const text = await response.text();
      console.log("Gemini Response:", text);

      // Instead of using placeholder.com, use a data URL for placeholder
      const placeholderDataUrl = `data:image/svg+xml,${encodeURIComponent(`
        <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="512" height="512" fill="#f0f0f0"/>
          <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#666" text-anchor="middle">
            Cartoon Preview
          </text>
        </svg>
      `)}`;

      setCartoonImage(placeholderDataUrl);
    } catch (error) {
      console.error("Gemini failed to process image:", error);
      setError("Failed to convert image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Avatar Page</h1>
      <p className="mt-4">Upload a 512x512 PNG image to cartoonify it!</p>

      <div className="mt-8">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full max-w-2xl">
            {selectedImageURL && (
              <div className="flex gap-8 items-center justify-center">
                <div>
                  <h3 className="mb-2 text-center font-semibold">Original</h3>
                  <div className="w-40 h-40 rounded-lg border-2 border-blue-500">
                    <img
                      src={selectedImageURL}
                      alt="Original"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
                {(loading || cartoonImage) && (
                  <div>
                    <h3 className="mb-2 text-center font-semibold">
                      {loading ? 'Converting...' : 'Cartoon Version'}
                    </h3>
                    <div className="w-40 h-40 rounded-lg border-2 border-green-500">
                      {loading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        </div>
                      ) : (
                        <img
                          src={cartoonImage!}
                          alt="Cartoon"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center mt-4">
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/png"
              className="hidden"
              id="avatar-upload"
              onChange={handleImageUpload}
              disabled={loading}
            />
            <label
              htmlFor="avatar-upload"
              className={`cursor-pointer px-4 py-2 rounded-md transition-colors
                ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              Upload Image
            </label>

            {selectedFile && !cartoonImage && (
              <button
                onClick={handleConvert}
                disabled={loading}
                className={`px-4 py-2 rounded-md transition-colors
                  ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                {loading ? 'Converting...' : 'Convert to Cartoon'}
              </button>
            )}
          </div>

          {cartoonImage && (
            <button
              onClick={() => {
                setSelectedFile(null);
                setSelectedImageURL(null);
                setCartoonImage(null);
              }}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Avatar;