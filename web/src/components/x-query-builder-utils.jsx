import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { isOptionGroupArray } from "react-querybuilder";

export const toSelectOptions = (list) =>
  isOptionGroupArray(list)
    ? list.map((og) => (
        <SelectGroup key={og.label}>
          <SelectLabel>{og.label}</SelectLabel>
          {og.options.map((opt) => (
            <SelectItem
              key={opt.name}
              value={opt.name ?? ""}
              disabled={!!opt.disabled}
            >
              <p className="text-foreground">{opt.label}</p>
              {opt.description && (
                <p className="text-muted-foreground" data-description>
                  {opt.description}
                </p>
              )}
            </SelectItem>
          ))}
        </SelectGroup>
      ))
    : Array.isArray(list)
      ? list.map((opt) => (
          <SelectItem
            key={opt.name}
            value={opt.name ?? ""}
            disabled={!!opt.disabled}
          >
            <p className="text-foreground">{opt.label}</p>
            {opt.description && (
              <p className="text-muted-foreground" data-description>
                {opt.description}
              </p>
            )}
          </SelectItem>
        ))
      : null;
