import Link from "next/link";

export default function Input({
  labelId,
  type,
  onChange,
  value,
  placeholder,
  children,
  link,
  required = false,
  options,
  multiple = false,
  accept,
  onRemove,
  min,
  readOnly = false,
}) {
  return (
    <div>
      <div className="flex justify-between align-center">
        <label
          htmlFor={labelId}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {children}
        </label>
        {link && (
          <div className="text-sm">
            <Link
              className="font-semibold text-indigo-600 hover:text-indigo-500"
              href={link.linkUrl}
            >
              {link.linkText}
            </Link>
          </div>
        )}
      </div>
      <div className="mt-2">
        {type === "select" ? (
          <select
            id={labelId}
            name={labelId}
            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={onChange}
            value={value}
            required={required}
          >
            <option value="">{placeholder || "Seleccionar..."}</option>
            {options && Array.isArray(options)
              ? options.map((opt, index) => (
                  <option key={`${opt.value}-${index}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : null}
          </select>
        ) : type === "file" && multiple ? (
          <div>
            <input
              id={labelId}
              name={labelId}
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={(e) => onChange(e.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required={required}
            />
            {/* Preview de imágenes */}
            {value && Array.isArray(value) && value.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {value.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => onRemove && onRemove(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            id={labelId}
            className={
              type === "checkbox"
                ? "form-checkbox rounded-full text-blue-600"
                : "block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            }
            name={labelId}
            type={type}
            rows={5}
            cols={40}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            required={required}
            min={min}
            readOnly={readOnly}
          />
        )}
      </div>
    </div>
  );
}
