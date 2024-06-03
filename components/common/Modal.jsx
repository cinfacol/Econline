"use client";
import { useAppDispatch } from "@/redux/hooks";
// import { clearCart } from '../features/cart/cartSlice';
import { closeModal } from "@/redux/features/modal/modalSlice";
import { Button } from "@nextui-org/button";

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
            onClick={() => {
              dispatch(closeModal());
            }}
          >
            confirm
          </Button>
          <Button
            type="button"
            className="btn clear-btn"
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
