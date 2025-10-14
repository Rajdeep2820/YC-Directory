import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date : string){
  return new Date(date).toLocaleDateString('en-US', {month : 'long' , year : 'numeric' , day : 'numeric'});
}

export function parseServerActionResponse<T>(respose: T){ 
  return JSON.parse(JSON.stringify(respose));
}

// <T> means “generic type placeholder” — it’s like saying “I don’t yet know what type this will be, but it’ll be decided later when the function/class/component is used.”