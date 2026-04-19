import React from 'react'
import { sorting as sortingOptions } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Sorting = ({
  limit,
  setLimit,
  sorting,
  setSorting,
  mobileFilterOpen,
  setMobileFilterOpen
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">

      {/* LEFT: SHOW LIMIT */}
      <ul className="flex items-center gap-3">
        <li className="font-semibold text-sm">Show</li>

        {[9, 12, 18, 24].map((limitNumber) => (
          <li key={limitNumber}>
            <button
              type="button"
              onClick={() => setLimit(limitNumber)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition
                ${
                  limitNumber === limit
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-black hover:text-white'
                }
              `}
            >
              {limitNumber}
            </button>
          </li>
        ))}
      </ul>

      {/* CENTER: SORTING */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">Sort:</span>

        <Select
          value={sorting}
          onValueChange={(value) => setSorting(value)}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Default Sorting" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {sortingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* RIGHT: MOBILE FILTER BUTTON */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="px-3 py-1 border rounded-md text-sm bg-white hover:bg-black hover:text-white transition"
        >
          Filters
        </button>
      </div>

    </div>
  )
}

export default Sorting