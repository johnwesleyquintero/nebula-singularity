import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

interface MarketplaceToggleProps {
  control: any
  marketplaceId: string
  marketplaceName: string
}

export function MarketplaceToggle({ control, marketplaceId, marketplaceName }: MarketplaceToggleProps) {
  return (
    <FormField
      control={control}
      name="marketplaces"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Switch
              checked={field.value?.includes(marketplaceId)}
              onCheckedChange={(checked) => {
                return checked
                  ? field.onChange([...field.value, marketplaceId])
                  : field.onChange(field.value?.filter((value: string) => value !== marketplaceId))
              }}
            />
          </FormControl>
          <FormLabel className="font-normal">{marketplaceName}</FormLabel>
        </FormItem>
      )}
    />
  )
}