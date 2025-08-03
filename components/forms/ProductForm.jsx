import { Input } from "@/components/forms";
import { Spinner } from "@/components/common";
import { Button } from "@/components/ui/button";

export default function Form({
  config,
  isLoading,
  btnText,
  onChange,
  onCheckboxChange,
  onSubmit,
}) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {config.map((field) => (
        <div key={field.labelId} className="form-group">
          <label htmlFor={field.labelId}>{field.labelText}</label>
          {field.type === "select" ? (
            <select
              id={field.labelId}
              value={field.value}
              onChange={(e) => onChange(e, field.labelId)}
              required={field.required}
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="" disabled>
                {field.placeholder}
              </option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <Input
              type={field.type}
              id={field.labelId}
              checked={field.value}
              onChange={(e) => onCheckboxChange(e, field.labelId)}
            />
          ) : field.type === "textarea" ? (
            <textarea
              type={field.type}
              id={field.labelId}
              onChange={(e) => onChange(e, field.labelId)}
              value={field.value}
              rows={field.rows}
              cols={field.cols}
              placeholder={field.placeholder}
              link={field.link}
              required={field.required}
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          ) : (
            <Input
              type={field.type}
              id={field.labelId}
              onChange={(e) => onChange(e, field.labelId)}
              value={field.value}
              placeholder={field.placeholder}
              link={field.link}
              required={field.required}
            />
          )}
        </div>
      ))}

      <div>
        <Button variant="default" className="font-bold" disabled={isLoading}>
          {isLoading ? <Spinner sm /> : `${btnText}`}
        </Button>
      </div>
    </form>
  );
}
