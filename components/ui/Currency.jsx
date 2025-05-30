"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const Currency = ({ value = 0 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="font-semibold">$0.00 USD</span>;
  }

  return (
    <span className="font-semibold">
      {formatter.format(Number(value))}
      <span className="text-sm"> USD</span>
    </span>
  );
};

export default Currency;
