import React from "react";

const ProgressBricks = ({heading="Learn your first 10 words", total = 10, current = 5 }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="sm:text-3xl text-2xl font-semibold mb-1">{heading}</h2>
      <div className="flex gap-2 w-full justify-center items-center">
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
