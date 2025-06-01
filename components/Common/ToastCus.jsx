import { Toast, useToastState } from "@tamagui/toast";
import React from "react";
import { YStack } from "tamagui";

const ToastCus = () => {
  const currentToast = useToastState();

  // Nếu không có toast nào đang hiển thị → không render gì cả
  if (!currentToast || currentToast.isHandledNatively) return null;

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      animation="200ms"
      enterStyle={{ opacity: 0, transform: [{ translateY: 100 }] }}
      exitStyle={{ opacity: 0, transform: [{ translateY: 100 }] }}
      transform={[{ translateY: 0 }]}
      opacity={1}
      scale={1}
      viewportName={currentToast.viewportName}
    >
      <YStack alignItems="center" justifyContent="center">
        <Toast.Title
          textAlign="center"
          fontSize="$5"
          color="$color"
          fontWeight="600"
        >
          {currentToast.title}
        </Toast.Title>
        {!!currentToast.message && (
          <Toast.Description textAlign="center">
            {currentToast.message}
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  );
};

export default ToastCus;
