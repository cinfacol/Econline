import { useState, useEffect } from "react";

export default function useSelectedCategories() {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("selectedCategoryIds");
      if (stored) {
        setSelectedCategoryIds(JSON.parse(stored));
      } else {
        setSelectedCategoryIds([]);
      }
    }
  }, []);

  return selectedCategoryIds;
}
