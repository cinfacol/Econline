"use client";

import usePreviewModal from "@/hooks/use-preview-modal";
import Gallery from "@/components/gallery";
import Info from "@/components/inventories/info";
import { Modal } from "@/components/ui";

const PreviewModal = () => {
  const previewModal = usePreviewModal();
  const inventoryId = previewModal?.data?.id;
  const auth = previewModal?.auth;
  if (!inventoryId) {
    return null;
  }

  return (
    <Modal open={previewModal.isOpen} onClose={previewModal.onClose}>
      <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
        <div className="sm:col-span-4 lg:col-span-5">
          <Gallery inventoryId={inventoryId} />
        </div>
        <div className="sm:col-span-8 lg:col-span-7">
          <Info inventoryId={inventoryId} auth={auth} />
        </div>
      </div>
    </Modal>
  );
};

export default PreviewModal;
