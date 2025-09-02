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
      {config.map((input) => (
        <Input
          key={input.labelId}
          {...input}
          onChange={
            input.onChange ? input.onChange : (e) => onChange(e, input.labelId)
          }
        >
          {input.labelText}
        </Input>
      ))}

      <div>
        <Button variant="default" className="font-bold" disabled={isLoading}>
          {isLoading ? <Spinner sm /> : `${btnText}`}
        </Button>
      </div>
    </form>
  );
}
