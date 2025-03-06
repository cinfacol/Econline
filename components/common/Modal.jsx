"use client";
import { useAppDispatch } from "@/redux/hooks";
import { closeModal } from "@/redux/features/modal/modalSlice";
import { Button } from "@/components/ui/button";

const Modal = () => {
  const dispatch = useAppDispatch();
  return (
    <aside className="modal-container">
      <div className="modal">
        <h4>remove all items from your shopping cart?</h4>
        <div className="btn-container">
          <Button
            onClick={() => {
              dispatch(closeModal());
            }}
          >
            confirm
          </Button>
          <Button
            onClick={() => {
              dispatch(closeModal());
            }}
          >
            cancel
          </Button>
        </div>
      </div>
    </aside>
  );
};
export default Modal;
