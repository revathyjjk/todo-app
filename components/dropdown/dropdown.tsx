"use client";

import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import styles from "./dropdown.module.css";

type Filter = "All" | "Todo" | "Done";

type DropdownProps = {
  value: Filter;
  onChange: (value: Filter) => void;
};

const options: Filter[] = ["All", "Todo", "Done"];

export default function Dropdown({ value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.dropdown}>
      <button
        className={styles.dropdownButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        {value}
        <FaAngleDown className={styles.icon} />
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <button
              key={option}
              className={styles.menuItem}
              onClick={() => {
                onChange(option);
                setOpen(false); // ✅ close after selection
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
