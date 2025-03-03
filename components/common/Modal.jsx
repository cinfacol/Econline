"use client";
import { useAppDispatch } from "@/redux/hooks";
import { closeModal } from "@/redux/features/modal/modalSlice";
import { Button } from "@heroui/button";

const Modal = () => {
  const dispatch = useAppDispatch();
  return (
    <aside className="modal-container">
      <div className="modal">
        <h4>remove all items from your shopping cart?</h4>
        <div className="btn-container">
          <Button
            type="button"
            className="btn confirm-btn"
            onPress={() => {
              dispatch(closeModal());
            }}
          >
            confirm
          </Button>
          <Button
            type="button"
            className="btn clear-btn"
            onPress={() => {
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
