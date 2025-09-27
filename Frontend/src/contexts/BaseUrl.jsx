import React, { createContext, useContext, useState } from "react";

const BaseUrlContext = createContext();

export const BaseUrlProvider = ({ children }) => {
  const [baseUrl, setBaseUrl] = useState("http://localhost:3300/api");

  return (
    <BaseUrlContext.Provider value={{ baseUrl, setBaseUrl }}>
      {children}
    </BaseUrlContext.Provider>
  );
};

export const useBaseUrl = () => {
  const context = useContext(BaseUrlContext);

  if (!context) {
    throw new Error("useBaseUrl must be used within a BaseUrlProvider");
  }

  return context;
};
