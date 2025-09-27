import axios from "axios";

const FileDelete = async (fileName, baseUrl) => {
  try {
    const response = await axios.delete(`${baseUrl}/files/delete/${fileName}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export default FileDelete;
