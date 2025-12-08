export const fileToGenerativePart = async (
  file: File
): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;

      if (!base64String) {
        return reject(new Error("Failed to read file as base64."));
      }

      const parts = base64String.split(",");
      const base64Data = parts.length > 1 ? parts[1] : parts[0];

      if (!base64Data) {
        return reject(new Error("Invalid base64 format from FileReader."));
      }

      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type || "application/octet-stream",
        },
      });
    };

    reader.onerror = () => reject(new Error("FileReader encountered an error."));
    reader.readAsDataURL(file);
  });
};

export const blobToGenerativePart = async (
  blob: Blob,
  mimeType: string
): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;

      if (!base64String) {
        return reject(new Error("Failed to read blob as base64."));
      }

      const parts = base64String.split(",");
      const base64Data = parts.length > 1 ? parts[1] : parts[0];

      if (!base64Data) {
        return reject(new Error("Invalid base64 format from FileReader."));
      }

      resolve({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || blob.type || "application/octet-stream",
        },
      });
    };

    reader.onerror = () => reject(new Error("FileReader encountered an error."));
    reader.readAsDataURL(blob);
  });
};