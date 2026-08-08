"use client";

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";

interface CategoryOption {
  readonly value: string;
  readonly label: string;
}

interface CategoryAndTagsFieldsProps {
  categories: readonly CategoryOption[];
  category: string;
  tags: string;
  tagPlaceholder: string;
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

export function CategoryAndTagsFields({
  categories,
  category,
  tags,
  tagPlaceholder,
  onCategoryChange,
  onTagsChange,
}: CategoryAndTagsFieldsProps) {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel>カテゴリ</InputLabel>
        <Select
          value={category}
          label="カテゴリ"
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="タグ（カンマ区切り）"
        value={tags}
        onChange={(event) => onTagsChange(event.target.value)}
        fullWidth
        placeholder={tagPlaceholder}
      />
    </>
  );
}

interface ResourcePublishedFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ResourcePublishedField({
  checked,
  onChange,
}: ResourcePublishedFieldProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
      }
      label="公開する"
    />
  );
}
