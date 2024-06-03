"use client";

import { useEffect, useState } from "react";

import PreviewModal from "@/components/previewModal";
import { useSelector } from "react-redux";

const ModalProvider = () => {
  const isOpen = useSelector((state) => state?.modal?.isOpen);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <PreviewModal />
    </>
  );
};

export default ModalProvider;
