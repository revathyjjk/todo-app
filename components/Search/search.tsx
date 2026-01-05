"use client";

import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import styles from "./search.module.css";

type SearchProps = {
  onSearch: (value: string) => void;
};

export default function Search({ onSearch }: SearchProps) {
  const [value, setValue] = useState("");

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search note..."
        className={styles.searchInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch(value); // ✅ search on Enter
        }}
      />

      <CiSearch
        className={styles.searchIcon}
        onClick={() => onSearch(value)} // ✅ search on icon click
      />
    </div>
  );
}
