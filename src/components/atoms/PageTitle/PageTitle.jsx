import React from "react";

const PageTitle = ({ title, subtitle }) => {
  return (
    <div className="flex items-start justify-center flex-col">
      <span className="text-2xl md:text-3xl font-semibold text-gray-800">
        {title}
      </span>
      <span className="text-lg font-semibold">{subtitle}</span>
    </div>
  );
};

export default PageTitle;
