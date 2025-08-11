import { AlertDialog, Button, XStack, YStack } from "tamagui";

export function AlertWarn({ isOpen, setIsOpen, action, msg }) {
  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Portal zIndex={1000}>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          zIndex={100}
        />
        <AlertDialog.Content
          bordered
          elevate
          zIndex={101}
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack padding="$3" gap="$2">
            <AlertDialog.Title size="$8" fontWeight="500">
              Attention
            </AlertDialog.Title>
            <AlertDialog.Description>
              {msg ? msg : " Do you really want to delete this habit ?"}
            </AlertDialog.Description>
            <XStack gap="$2" justifyContent="flex-end" marginTop="$3">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="red" onPress={action}>
                  Accept
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
