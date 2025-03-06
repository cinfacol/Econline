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
          labelId={input.labelId}
          type={input.type}
          onChange={onChange}
          value={input.value}
          placeholder={input.placeholder}
          link={input.link}
          required={input.required}
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
