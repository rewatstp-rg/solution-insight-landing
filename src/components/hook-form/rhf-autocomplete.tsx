import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';

import { BaseOption } from 'src/api/base/types';

// ----------------------------------------------------------------------

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'country' | string;
  helperText?: React.ReactNode;
  value?: any;
  options: any[];
  required?: boolean;
  viewType?: string;
  onChangeInput?: any;
}

export function RHFAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  name,
  label,
  type,
  helperText,
  placeholder,
  value,
  options = [],
  required,
  viewType,
  onChangeInput,
  size = 'medium',
  ...other
}: Omit<Props<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'>) {

  const { control, setValue } = useFormContext();
  // const [optionValue, setOptionValue] = useState<any>(null);
  const [inputValue, setInputValue] = useState<any>('');

  const isDetail = () => viewType === 'inquiry';
  const theme = useTheme();

  const disableAutocomplete = () => {
    document.querySelectorAll("input").forEach((input) => {
      input.setAttribute("autocomplete", "off");
    });
  };

  // const { multiple } = other;
  // useEffect(() => {
  //   let item = null;
  //   if (value) {
  //     item = options.find((x: BaseOption) => x.id === value);
  //   }
  //   if (item) {
  //     setOptionValue(item);
  //   } else {
  //     setOptionValue(null);
  //   }

  //   disableAutocomplete();
  //   // }, [options]);
  // }, [value, options]);

  useEffect(() => {
    disableAutocomplete();
  }, [])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        console.log("🚀 ~ error: auto", error)
        return isDetail() ? (
          	<Box>
            	<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              	{label}
            	</Typography>
            	<Typography variant="body2" sx={{ color: theme.palette.primary.main, fontFamily: 'line-seedsans-bold' }}>
              	{options && options.length && options.find((x: BaseOption) => x.id?.toString() === field.value?.toString())?.name || '-'}
            	</Typography>
          	</Box>
        	) : (
          	<Autocomplete
            	sx={{ width: '100%',marginBottom: 'auto' }}
            	size={size}
            	{...field}
            	id={`autocomplete-${name}`}
            	value={options?.find((x: BaseOption) => x.id?.toString() === field.value?.toString()) || null}
            	inputValue={inputValue}
            	onInputChange={(_event, newInputValue) => {
              	setInputValue(newInputValue);
            	}}
            	options={options}
            	getOptionLabel={(option: any) => option?.label || ''}
            	isOptionEqualToValue={(option: any, values: any) =>
              	option?.id === values?.id
            	}
            	onChange={(_event, newValue: any) => {
              	if (onChangeInput) {
                	onChangeInput({
                  	target: {
                    	name,
                    	value: newValue?.id,
                  	},
                	})
              	}
              	setValue(name, newValue?.id, { shouldValidate: true })
            	}}
            	renderInput={(params) => (
              	<TextField
                	{...params}
                	label={label}
                	required={required}
                	placeholder={placeholder}
                	error={!!error}
                	helperText={error ? error?.message : helperText}
                	inputProps={{
                  	...params.inputProps,
                  	autoComplete: 'new-password',
                	}}
              	/>
            	)}
            	{...other}
          	/>
      
      	)}
      }
    />
  );
}
