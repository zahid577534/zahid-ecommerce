
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
 import axios from "axios";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sizes = [
  {label: "S", values: 'S'},
   {label: "M", values: 'M'},
    {label: "L", values: 'L'},
     {label: "XL", values: 'XL'},
      {label: "2XL", values: '2XL'},
  ];

  export const sorting = [
    { label: "Default Sorting", value: "default_sorting" },
    {label:'Assending Order', value:'asc'},
     {label:'Descending Order', value:'desc'},
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest Arrivals", value: "newest" },
  ]


const instance = axios.create({
  withCredentials: true, // ✅ always send cookies
});

export default instance;