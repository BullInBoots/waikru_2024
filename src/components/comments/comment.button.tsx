"use client";
import { AiOutlinePlus } from "react-icons/ai";
import Button from "../ui/button";
import { useModal } from "@/src/context/ModalContext";

const CommentFloatButton = () => {
  const { setModalState } = useModal();

  const handleClick = () => {
    setModalState("selectTray");
  };
  return (
    <Button onClick={handleClick} shadow>
      <h1>Create pedestal tray</h1>
      <AiOutlinePlus />
    </Button>
  );
};

export default CommentFloatButton;