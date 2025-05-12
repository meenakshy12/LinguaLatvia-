import React from "react";

const ProgressBricks = ({subheading,heading="Learn your first 10 words", total = 10, current = 5 }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="sm:text-3xl text-2xl font-semibold ">{heading}</h2>
      {subheading && <p className="text-sm text-[#00000099] ">{subheading}</p>}
      <div className="flex gap-2 w-full justify-center items-center mt-1">
        {[...Array(total)].map((_, index) => (
          <div
            key={index}
            className={`h-1.5 sm:w-7 w-5 rounded-full ${
              index === current - 1
                ? "bg-[#FBF711]"
                : "bg-[#D9D9D9]"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBricks;

