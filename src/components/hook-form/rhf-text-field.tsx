import { Controller, useFormContext } from 'react-hook-form';
import { memo, useRef, useState, useEffect, FocusEvent, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';

import { useDebounce } from 'src/hooks/use-debounce';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  viewType?: string;
  inputType?: string;
  isDebouncedQuery?: boolean;
};

export const RHFTextField = memo(({ name, helperText, type, viewType, label, inputProps, inputType, size = 'medium', isDebouncedQuery = false, ...other }: Props) => {
  const { control } = useFormContext();
  const isDetail = () => viewType === 'inquiry';
  const theme = useTheme();

  const onlyNumbersRegex = /^[0-9]*$/;

  return (
    <Controller
      name={name}
      control={control}
      render={
        ({ field, fieldState: { error } }) => (
          isDetail() ? (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {label}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontFamily: 'line-seedsans-bold' }}>
                {field.value || '-'}
              </Typography>
            </Box>
          ) : (
            <InputField
              field={field}
              label={label}
              size={size}
              type={type}
              isDebouncedQuery={isDebouncedQuery}
              inputType={inputType}
              onlyNumbersRegex={onlyNumbersRegex}
              error={error}
              helperText={helperText}
              inputProps={inputProps}
              {...other}
            />
          )
        )}
    />
  )
})

// const InputField = memo(({ field, label, size, type, inputType, onlyNumbersRegex, error, helperText, inputProps, isDebouncedQuery, ...other }: any) => {

//   const ref: any = useRef<HTMLDivElement>();

//   const [localValue, setLocalValue] = useState(field.value);

//   const debouncedQuery = useDebounce(localValue, isDebouncedQuery ? 500 : 0);

//   const onlyCurrencyRegex = /(?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$/;

//   const numberStyle = { textAlign: 'end' };
//   const normalStyle = { textAlign: 'left' };

//   const formatCurrency = (amount: any) => {
//     // eslint-disable-next-line
//     /** ลบอักขระที่ไม่ใช่ตัวเลขออกจากอินพุต */
//     const userInput: string = amount.replace(/[^0-9]/g, '');

//     if (userInput === '') {
//       // eslint-disable-next-line
//       /** หากอินพุตว่างเปล่า ให้ตั้งค่าที่จัดรูปแบบเป็น "0.00" */
//       return '0.00';
//     }
//     // eslint-disable-next-line
//     /**แปลงอินพุตเป็นตัวเลขแล้วหารด้วย 100 เพื่อให้ได้ค่าเป็น BRL */
//     const userInputAsNumber: number = parseInt(userInput, 10) / 100;
//     // eslint-disable-next-line
//     return `${userInputAsNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.")}`;
//   };

//   const handleInputChange = (event: any) => {
//     if (type === 'number') {
//       // field.onChange(Number(event.target.value));

//       if (event.target.value[0] === '0' && event.target.value.length > 1 && event.target?.value[1] !== '.') {
//         setLocalValue(event.target.value.slice(1));
//       } else if (event.target.value[0] === '-') {
//         setLocalValue(event.target.value.slice(1));
//       } else {
//         setLocalValue(event.target.value);
//       }
//     } else if (type === 'text' && inputType === 'numberChar') {
//       if (onlyNumbersRegex.test(event.target.value[event.target.value.length - 1])) {
//         // setLocalValue(event.target.value);
//         if (event.target.value.length > 1 && event.target.value[0] === '0') {
//           setLocalValue(event.target.value.slice(1));
//         } else {
//           setLocalValue(event.target.value);
//         }
//         // field.onChange(event.target.value);
//       } else {
//         setLocalValue(event.target.value.replace(event.target.value[event.target.value.length - 1], ''));
//       }
//     } else if (inputType === "CURRENCY") {
//       if (onlyCurrencyRegex.test(event.target.value[event.target.value.length - 1])) {
//         field.onChange(formatCurrency(event.target.value));
//       } else {
//         field.onChange(event.target.value.replace(event.target.value[event.target.value.length - 1], ''));
//       }
//     } else {
//       setLocalValue(event.target.value);
//     }
//   }

//   useEffect(() => {
//     field.onChange(localValue);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [debouncedQuery])

//   // useEffect(() => {
//   //   setLocalValue(field.value);
//   // }, [field.value])

//   return (
//     <TextField
//       ref={ref}
//       {...field}
//       label={label}
//       fullWidth
//       size={size}
//       type={type}
//       value={type === 'number' && localValue === 0 ? '' : localValue}
//       onChange={(event) => {
//         handleInputChange(event);
//       }}
//       error={!!error}
//       helperText={error ? error?.message : helperText}
//       inputProps={{ ...inputProps, style: (inputType === "CURRENCY" || type === 'number') ? numberStyle : normalStyle }}
//       required={false}
//       {...other}
//     />
//   );
// })


const InputField = memo(({ field, label, size, type = 'text', inputType, onlyNumbersRegex, error, helperText, inputProps, isDebouncedQuery = false, ...other }: any) => {

  // console.log("🚀 ~ InputField ~ type:", type)
  // console.log("🚀 ~ error: InputField", error)

  const ref: any = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState<any>(field.value);
  // console.log("🚀 ~ InputField ~ localValue:", localValue)
  const debouncedQuery = useDebounce(localValue, isDebouncedQuery ? 500 : 0);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      field.onChange(localValue);
    }
  }
  const handleInputChange = (event: any) => {
    // console.log("🚀 ~ file: rhf-text-field.tsx:67 ~ handleInputChange ~ event:", event)
    if (type === 'number') {
      // field.onChange(Number(event.target.value));
      // setLocalValue(Number(event.target.value));
      setTextIsNotDebouncedQuery(Number(event.target.value));
      event.preventDefault();
    } else if (type === 'text' && inputType === 'numberChar') {
      if (onlyNumbersRegex.test(event.target.value[event.target.value.length - 1])) {

        if (event.target.value.length > 1 && event.target.value[0] === '0') {
          // setLocalValue(event.target.value.slice(1));
          setTextIsNotDebouncedQuery(event.target.value.slice(1));
          event.preventDefault();
        } else {
          // setLocalValue(event.target.value);
          setTextIsNotDebouncedQuery(event.target.value);
          event.preventDefault();
        }

        // field.onChange(event.target.value);
      } else {
        // setLocalValue(event.target.value.replace(event.target.value[event.target.value.length - 1], ''));
        setTextIsNotDebouncedQuery(event.target.value.replace(event.target.value[event.target.value.length - 1], ''));
        event.preventDefault();
      }
    } else if (type === 'text' && inputType === 'numberText') {
      if (onlyNumbersRegex.test(event.target.value[event.target.value.length - 1])) {
        // setLocalValue(event.target.value);
        setTextIsNotDebouncedQuery(event.target.value);
        event.preventDefault();
      } else {
        // setLocalValue(event.target.value.replace(event.target.value[event.target.value.length - 1], ''));
        setTextIsNotDebouncedQuery(event.target.value.replace(event.target.value[event.target.value.length - 1], ''));
        event.preventDefault();
      }
    } else {
      // setLocalValue(event.target.value);
      // console.log("text", event.target.value);
      setTextIsNotDebouncedQuery(event.target.value);
      event.preventDefault();
    }
  }

  const setTextIsNotDebouncedQuery = (text: any) => {
    // console.log("🚀 ~ setTextIsNotDebouncedQuery ~ text:", text)
    setLocalValue(text);
    if (type === 'number') {
      field.onChange(text);
    }

  }
 
   

  const inputOnBlur = useCallback((e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    field.onChange(localValue);
    field.onBlur(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue])

  useEffect(() => {
    if (isDebouncedQuery) {
      if (field.value !== localValue && !localValue) {
        field.onChange(localValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {

    if ((!localValue || localValue === '' || localValue === undefined || localValue === null || localValue === '0' || localValue === 0) || field.value !== localValue) {
      setLocalValue(field.value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value])

  return (
    <TextField
      ref={ref}
      {...field}
      label={label}
      fullWidth
      size={size}
      type={type}
      value={localValue}
      onKeyDown={handleKeyDown}
      onChange={(event) => {
        // console.log("🚀 ~ InputField ~ event:", event)
        handleInputChange(event);
        // setTextIsNotDebouncedQuery(event.target.value);
      }}
      error={!!error}
      helperText={error ? error?.message : helperText}
      inputProps={inputProps}
      required={false}
      onBlur={(e) => inputOnBlur(e)}
      {...other}
    />
  );
})

