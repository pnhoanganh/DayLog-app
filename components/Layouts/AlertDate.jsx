import { AlertDialog, Button, XStack, YStack } from "tamagui";

export function AlertDate({ isOpen, setIsOpen, date, count }) {
  // Không render dialog khi isOpen là false
  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.8}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
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
          <YStack padding="$4" gap="$3">
            <AlertDialog.Title size="$6" fontWeight="700">
              Check-in Date
            </AlertDialog.Title>
            <AlertDialog.Description textAlign="center">
              {date
                ? `${date.toDateString()}\nCheck-ins: ${count ?? 0}`
                : "No date selected"}
            </AlertDialog.Description>
            <XStack gap="$3" justifyContent="center">
              <AlertDialog.Cancel asChild>
                <Button size="$2" width="50%">
                  Ok
                </Button>
              </AlertDialog.Cancel>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
