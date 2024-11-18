import { FormDescription, FormField, FormItem } from "@/components/ui/form";
import { cuisinsList } from "@/config/restaurant.option.config";
import { useFormContext } from "react-hook-form";
import CuisinesCheckbox from "./CuisinesCheckbox";

const CuisinesSection = () => {
  const { control } = useFormContext();
  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Cuisines</h2>
        <FormDescription>
          Select the cuisine that your restaurant serves
        </FormDescription>
      </div>
      <FormField
        control={control}
        name="cuisines"
        render={({ field }) => (
          <FormItem>
            <div className="grid md:grid-cols-5 gap-1">
              {cuisinsList.map((cuisine, i) => (
                <CuisinesCheckbox
                  key={cuisine + i}
                  cuisine={cuisine}
                  field={field}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CuisinesSection;
