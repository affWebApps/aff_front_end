import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface FormSelectProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  required = false,
  value,
  onChange,
  options,
  placeholder = "Choose an option",
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <FormControl fullWidth>
        <Select
          value={value}
          onChange={onChange}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            borderRadius: "0.75rem",
            backgroundColor: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgb(209, 213, 219)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgb(156, 163, 175)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FAB75B",
              borderWidth: "2px",
            },
            "& .MuiSvgIcon-root": {
              color: "rgb(107, 114, 128)",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "white",
                "& .MuiMenuItem-root": {
                  "&:hover": {
                    backgroundColor: "rgba(250, 183, 91, 0.1)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(250, 183, 91, 0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(250, 183, 91, 0.3)",
                    },
                  },
                },
              },
            },
          }}
        >
          {!value && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
