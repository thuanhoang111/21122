import {
  Alert,
  CloseIcon,
  HStack,
  IconButton,
  Text,
  VStack,
} from "native-base";

/**
 * @param id Identify of Toast
 * @param status Status of Toast ( "info" | "error" | "success" | "warning")
 * @param variant The variant of the alert style to use ("subtle" | "solid" | "outline" | "left-accent" | "top-accent" | "outline-light" )
 * @param title
 * @param description
 * @param isClosable Show icon close manual toast
 */
export default ToastNotification = ({
  toast,
  id,
  status,
  variant,
  title,
  description,
  onClose,
  ...rest
}) => (
  <Alert
    maxWidth="100%"
    alignSelf="center"
    flexDirection="row"
    status={status ? status : "info"}
    variant={variant}
    {...rest}
  >
    <VStack space={1} flexShrink={1} w="98%">
      <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
        <HStack space={2} flexShrink={1} alignItems="center">
          <Alert.Icon />
          <Text
            fontSize="md"
            flexShrink={1}
            color={
              variant === "solid"
                ? "lightText"
                : variant !== "outline"
                ? "darkText"
                : null
            }
          >
            {title}
          </Text>
        </HStack>
        {onClose ? (
          <IconButton
            variant="unstyled"
            icon={<CloseIcon size="3" />}
            _icon={{
              color: variant === "solid" ? "lightText" : "darkText",
            }}
            onPress={() => onClose()}
          />
        ) : null}
      </HStack>
      <Text
        px="6"
        color={
          variant === "solid"
            ? "lightText"
            : variant !== "outline"
            ? "darkText"
            : null
        }
      >
        {description}
      </Text>
    </VStack>
  </Alert>
);
