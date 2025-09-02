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
            {options && Array.isArray(options)
              ? options.map((opt, index) => (
                  <option key={`${opt.value}-${index}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : null}
          </select>
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
          />
        )}
      </div>
    </div>
  );
}
