import { useDropzone } from "react-dropzone";
import './LogoUpload.css';
export default function LogoUpload({ onDrop, accept, title, description, multiple, uploadedFiles, onRemoveFile }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize: 2 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            alert(`File ${file.file.name} is too large. Maximum size is 2MB.`);
          }
        });
      });
    }
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone mt-1 p-4 border-2 border-dashed rounded-md text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
          <ul className="list-disc pl-5 text-xs text-gray-600">
            {uploadedFiles.map((fileItem, index) => (
              <li key={`${fileItem.name}-${index}`} className="flex items-center justify-between py-1">
                <span>
                  {fileItem.name} - {(fileItem.size / 1024).toFixed(2)} KB
                  <span className="text-green-600 ml-2">✓ Ready for upload</span>
                </span>
                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

