import { useState } from 'react';
import axios from 'axios';

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setSelectedImageURL(URL.createObjectURL(file));
  };

  // const handleConvert = async () => {
  //   if (!selectedFile) return;
  //   setLoading(true);

  //   try {
  //     // OpenAI requires specific image format and size
  //     // The image must be a square PNG of less than 4MB
  //     const formData = new FormData();
  //     formData.append("image", selectedFile);
  //     formData.append("n", "1");
  //     formData.append("size", "512x512");
  //     formData.append("response_format", "url");

  //     const response = await axios.post(
  //       "https://api.openai.com/v1/images/variations",
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     setCartoonImage(response.data.data[0].url);
  //     console.log("Image variation URL:", response.data.data[0].url);
  //   } catch (error) {
  //     console.error("Failed to convert image:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

 

const handleConvert = async (file: File | null) => {
  if (!file) {
    console.error("No file provided");
    return; // Or throw an error, depending on your application's needs
  }

  // Check if the file is an image (adjust types as needed)
  if (!file.type.startsWith('image/')) {
    console.error("File is not an image. Please upload an image file.");
    return;
  }
  
  const formData = new FormData();
  formData.append('image', file);
  // Consider adding other parameters if needed, e.g., 'n' for number of variations
  // formData.append('n', '2');

  try {
    const response = await axios.post('https://api.openai.com/v1/images/variations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Replace with your actual API key
      },
    });

    console.log('Image variations generated:', response.data);
    // Process the response data (e.g., display the generated images)
  } catch (error: any) {
    console.error('Error generating image variations:', error);

    // Enhanced error handling: Log more details if available.
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
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
                {cartoonImage && (
                  <div>
                    <h3 className="mb-2 text-center font-semibold">Cartoon Version</h3>
                    <div className="w-40 h-40 rounded-lg border-2 border-green-500">
                      <img
                        src={cartoonImage}
                        alt="Cartoon"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
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