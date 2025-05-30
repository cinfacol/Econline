"use client";

import { useEffect, useState } from "react";

const FreeShippingBanner = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
      Get free delivery on orders over $15
    </p>
  );
};

export default FreeShippingBanner; 