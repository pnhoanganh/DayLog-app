import { AlertDialog, Button, YStack } from "tamagui";

const AlertMessage = ({ isOpen, setIsOpen, message, title, colorTitle }) => {
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
          zIndex={99999}
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
          zIndex={100001}
          width={"80%"}
        >
          <YStack padding="$1" gap="$3">
            <AlertDialog.Title
              size="$6"
              fontWeight="700"
              color={colorTitle}
              textAlign="center"
            >
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description textAlign="center" fontSize="$3">
              {message}
            </AlertDialog.Description>
            <AlertDialog.Cancel asChild alignSelf="center">
              <Button size="$3" width="30%">
                Ok
              </Button>
            </AlertDialog.Cancel>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default AlertMessage;
