import { Center, HStack, Skeleton } from "native-base";

function SkeletonChartBar() {
  return (
    <HStack
      w="100%"
      paddingX={5}
      space={2}
      height="95%"
      alignItems={"flex-end"}
      borderBottomWidth={1}
      borderBottomColor={"#d4d4d4"}
    >
      {Array.from({ length: 12 }, (_, index) => (
        <Skeleton key={index} flex={1} height={`${Math.random() * 100}%`} />
      ))}
    </HStack>
  );
}

export default SkeletonChartBar;
