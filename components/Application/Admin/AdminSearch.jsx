"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import SearchModal from "./SearchModel"; // ✅ FIXED NAME

const AdminSearch = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:w-[350px]">
      <div className="flex justify-between items-center relative">
        
        <Input
          readOnly
          className="rounded-full cursor-pointer"
          placeholder="Search..."
          onClick={() => setOpen(true)}
        />

        <button
          type="button"
          className="absolute right-3 cursor-default"
        >
          <IoIosSearch />
        </button>

        <SearchModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default AdminSearch;