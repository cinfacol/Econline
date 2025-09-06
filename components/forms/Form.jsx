import { Input } from "@/components/forms";
import { Spinner } from "@/components/common";
import { Button } from "@/components/ui/button";

export default function Form({
  config,
  isLoading,
  btnText,
  onChange,
  onSubmit,
}) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {config.map((input) =>
        input.type === "custom" ? (
          <div key={input.labelId}>
            <div className="flex justify-between align-center">
              <label
                htmlFor={input.labelId}
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {input.labelText}
              </label>
            </div>
            <div className="mt-2">
              {input.customRender && input.customRender()}
            </div>
          </div>
        ) : (
          <Input
            key={input.labelId}
            {...input}
            onChange={
              input.onChange
                ? input.onChange
                : (e) => onChange(e, input.labelId)
            }
          >
            {input.labelText}
          </Input>
        )
      )}

      <div>
        <Button variant="default" className="font-bold" disabled={isLoading}>
          {isLoading ? <Spinner sm /> : `${btnText}`}
        </Button>
      </div>
    </form>
  );
}
