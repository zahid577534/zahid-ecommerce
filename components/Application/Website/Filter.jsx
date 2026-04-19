'use client'

import React, { useEffect, useState } from 'react'
import useFetch from '@/hooks/useFetch'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 30000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const { data: categoryData } = useFetch("/api/category/get-category")
  const { data: colorsData } = useFetch("/api/product-variant/color")
  const { data: sizesData } = useFetch("/api/product-variant/size")

  // ✅ Restore filters from URL
  useEffect(() => {
    const category = searchParams.get("category");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const price = searchParams.get("price");

    setSelectedCategories(category ? category.split(",") : []);
    setSelectedColors(color ? color.split(",") : []);
    setSelectedSizes(size ? size.split(",") : []);

    if (price) {
      const [min, max] = price.split("-");
      setPriceFilter({
        minPrice: Number(min),
        maxPrice: Number(max),
      });
    }
  }, [searchParams]);

  const urlSearchParams = new URLSearchParams(searchParams.toString());

  // ✅ PRICE CHANGE
  const handlePriceChange = (value) => {
    setPriceFilter({ minPrice: value[0], maxPrice: value[1] });
  };

  // ✅ APPLY PRICE
  const handlePriceFilter = () => {
    urlSearchParams.set(
      "price",
      `${priceFilter.minPrice}-${priceFilter.maxPrice}`
    );

    router.push(`${WEBSITE_SHOP}?${urlSearchParams.toString()}`);
  };

  // ✅ CLEAR ALL FILTERS
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceFilter({ minPrice: 0, maxPrice: 30000 });

    router.push(WEBSITE_SHOP);
  };

  // ✅ CATEGORY
  const handleCategoryFilter = (slug) => {
    let updated = [...selectedCategories];

    if (updated.includes(slug)) {
      updated = updated.filter(c => c !== slug);
    } else {
      updated.push(slug);
    }

    setSelectedCategories(updated);

    updated.length > 0
      ? urlSearchParams.set("category", updated.join(","))
      : urlSearchParams.delete("category");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams.toString()}`);
  };

  // ✅ COLOR
  const handleColorFilter = (color) => {
    let updated = [...selectedColors];

    if (updated.includes(color)) {
      updated = updated.filter(c => c !== color);
    } else {
      updated.push(color);
    }

    setSelectedColors(updated);

    updated.length > 0
      ? urlSearchParams.set("color", updated.join(","))
      : urlSearchParams.delete("color");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams.toString()}`);
  };

  // ✅ SIZE
  const handleSizeFilter = (size) => {
    let updated = [...selectedSizes];

    if (updated.includes(size)) {
      updated = updated.filter(s => s !== size);
    } else {
      updated.push(size);
    }

    setSelectedSizes(updated);

    updated.length > 0
      ? urlSearchParams.set("size", updated.join(","))
      : urlSearchParams.delete("size");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams.toString()}`);
  };

  const isClearDisabled =
    !selectedCategories.length &&
    !selectedColors.length &&
    !selectedSizes.length &&
    priceFilter.minPrice === 0 &&
    priceFilter.maxPrice === 30000;

  return (
    <div className="w-full md:w-64 lg:w-72 p-3 md:p-4 border rounded-xl bg-white shadow-sm">

      {/* 🔥 HEADER WITH CLEAR BUTTON */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold uppercase">Filters</h2>

        <button
          onClick={handleClearFilters}
          disabled={isClearDisabled}
          className="text-xs text-red-500 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['1', '2', '3', '4']}
        className="w-full space-y-2"
      >

        {/* CATEGORY */}
        <AccordionItem value="1">
          <AccordionTrigger className='uppercase font-semibold text-sm'>
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className='max-h-48 overflow-y-auto pr-2'>
              {categoryData?.data?.map((category) => (
                <label
                  key={category._id}
                  className='flex items-center space-x-3 text-sm cursor-pointer py-1 hover:text-black'
                >
                  <Checkbox
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={() => handleCategoryFilter(category.slug)}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* COLORS */}
        <AccordionItem value="2">
          <AccordionTrigger className='uppercase font-semibold text-sm'>
            Colors
          </AccordionTrigger>
          <AccordionContent>
            <div className='max-h-48 overflow-y-auto pr-2'>
              {colorsData?.data?.map((color) => (
                <label
                  key={color.name}
                  className='flex items-center space-x-3 text-sm cursor-pointer py-1 hover:text-black'
                >
                  <Checkbox
                    checked={selectedColors.includes(color.name)}
                    onCheckedChange={() => handleColorFilter(color.name)}
                  />
                  <span>{color.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SIZES */}
        <AccordionItem value="3">
          <AccordionTrigger className='uppercase font-semibold text-sm'>
            Sizes
          </AccordionTrigger>
          <AccordionContent>
            <div className='max-h-48 overflow-y-auto pr-2'>
              {sizesData?.data?.map((size) => (
                <label
                  key={size}
                  className='flex items-center space-x-3 text-sm cursor-pointer py-1 hover:text-black'
                >
                  <Checkbox
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => handleSizeFilter(size)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PRICE */}
        <AccordionItem value="4">
          <AccordionTrigger className='uppercase font-semibold text-sm'>
            Price
          </AccordionTrigger>

          <AccordionContent>
            <div className='flex flex-col gap-4 pt-2'>

              {/* SLIDER */}
              <div className="px-2">
                <Slider
                  value={[priceFilter.minPrice, priceFilter.maxPrice]}
                  max={30000}
                  step={1}
                  onValueChange={handlePriceChange}
                  className="
                    cursor-pointer
                    [&_[role=slider]]:bg-black
                    [&_[role=slider]]:border-2
                    [&_[role=slider]]:border-white
                    [&_.relative]:h-2
                    [&_.relative]:bg-gray-200
                    [&_.relative>span]:bg-black
                  "
                />
              </div>

              {/* PRICE LABELS */}
              <div className='flex justify-between text-sm font-medium text-gray-700'>
                <span className="bg-gray-100 px-3 py-1 rounded-md">
                  ${priceFilter.minPrice}
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-md">
                  ${priceFilter.maxPrice}
                </span>
              </div>

              {/* BUTTON */}
              <Button
                onClick={handlePriceFilter}
                className="w-full rounded-full bg-black text-white hover:bg-gray-800 transition"
              >
                Apply Price
              </Button>

            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default Filter;