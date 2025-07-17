import type { ReactNode } from "react";
import "./Modal.scss";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, className, children }: ModalProps) {
  return (
    isOpen && (
      <div className="modal-cantainer">
        <div className={`modal-content ${className || ""}`}>{children}</div>
      </div>
    )
  );
}
