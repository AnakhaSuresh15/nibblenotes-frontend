import { useRef, useState, useEffect } from "react";
import { FaImage } from "react-icons/fa";

const ImageUploader = ({ value, onChange }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    // File object (new upload)
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }

    // String URL (edit mode)
    if (typeof value === "string") {
      setPreview(value);
    }
  }, [value]);

  const handleSelect = () => fileRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className="flex flex-col w-full h-full items-center gap-2">
      <div
        onClick={handleSelect}
        className="w-full h-full flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="object-cover md:w-60 md:h-60 w-50 h-50"
          />
        ) : (
          <>
            <FaImage size={40} />
            <span className="text-xs">Add Image</span>
          </>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
