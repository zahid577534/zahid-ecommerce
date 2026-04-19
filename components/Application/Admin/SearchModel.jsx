"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js"; // ✅ FIX
import searchData from "@/lib/search";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const options = {
  keys: ["label", "description", "keywords"],
  threshold: 0.3,
};

const SearchModal = ({ open, setOpen }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  // ✅ optimize fuse
  const fuse = useMemo(() => new Fuse(searchData, options), []);

  useEffect(() => {
    if (query.trim() === "") {
      setResult([]);
      return;
    }

    const res = fuse.search(query);
    setResult(res.map((r) => r.item));
  }, [query, fuse]);

  const displayData = query ? result : searchData;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quick Search</DialogTitle>
          <DialogDescription>
            Navigate quickly to any admin section
          </DialogDescription>
        </DialogHeader>

        <input
          type="text"
          placeholder="Type to search..."
          className="w-full mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <ul className="mt-4 max-h-60 overflow-y-auto">
          {displayData.length > 0 ? (
            displayData.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.url || "#"}
                  className="block py-2 px-3 rounded hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  <h4 className="font-medium">{item.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              </li>
            ))
          ) : (
            <p className="text-sm text-muted-foreground px-3 py-2">
              No results found
            </p>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;