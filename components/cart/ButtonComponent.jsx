import { Button } from "@nextui-org/button";
import { ShoppingCart } from "lucide-react";
import React from "react";

const ButtonComponent = ({ onClick, icon, color, comment }) => {
  return (
    <div>
      <Button color={color} endContent={icon}>
        {comment}
      </Button>
    </div>
  );
};

export default ButtonComponent;
