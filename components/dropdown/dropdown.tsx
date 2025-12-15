"use client";

import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import styles from "./dropdown.module.css"

const options = ["All", "Todo", "Done"];

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={styles.dropdownButton}
      >
        {selected ?? "All"}
        <FaAngleDown className={styles.icon} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map(option => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={styles.menuItem}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
