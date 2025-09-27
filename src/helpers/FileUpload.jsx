// FileUpload.jsx
import axios from "axios";

const FileUpload = async (file, baseUrl) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${baseUrl}/files/save`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data.status) {
      console.log("Upload failed:", response.data);
      return null;
    }

    return response.data.fileName;
  } catch (error) {
    console.error("Error in FileUpload:", error);
    return null;
  }
};

export default FileUpload;
