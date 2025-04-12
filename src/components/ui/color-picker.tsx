// components/ui/color-picker.tsx
"use client"

import { Input } from "./input"

export function ColorPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-8 h-8 rounded-md border" 
        style={{ backgroundColor: value || "#000000" }}
      />
      <Input 
        type="color" 
        value={value || "#000000"} 
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 p-0"
      />
      <Input 
        type="text" 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="w-28"
      />
    </div>
  )
}
