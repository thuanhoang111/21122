import { Center, HStack, Skeleton } from "native-base";

function SkeletonChartBar() {
  return (
    <Center w="350">
      <HStack
        w="90%"
        maxW="400"
        overflow="scroll"
        space={4}
        borderColor={"#e3e3e4"}
        borderLeftWidth="3"
        borderBottomWidth="3"
        height="80%"
        alignItems={"flex-end"}
        r
      >
        <Skeleton h="100%" w={10} marginLeft={5} borderTopRadius={10} />
        <Skeleton h="80%" w={10} borderTopRadius={10} />
        <Skeleton h="20%" w={10} borderTopRadius={10} />
        <Skeleton h="50%" w={10} borderTopRadius={10} />
        <Skeleton h="40%" w={10} borderTopRadius={10} />
      </HStack>
    </Center>
  );
}

export default SkeletonChartBar;
