import { HStack, Skeleton, VStack, View } from "native-base";
function SkeletonTable({ length = 5, numberInLine = 1 }) {
  return (
    <View
      style={{
        borderRadius: 25,
        borderWidth: 0.5,
        borderColor: "#d2d0d1",
        width: "98%",
      }}
    >
      <HStack
        space={10}
        rounded="3xl"
        alignItems="center"
        p={3}
        style={{
          backgroundColor: "#b8c0c2",
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        <HStack flex="2" space="8">
          <Skeleton.Text w={"100%"} lines={1} />
        </HStack>
      </HStack>
      <HStack
        w={"100%"}
        rounded={"3xl"}
        marginTop={1}
        alignItems="center"
        p={4}
      >
        <VStack flex="2" space="6">
          {Array.from({ length: length }).map((_, index) => {
            return (
              <HStack
                key={index}
                alignItems={"center"}
                space={2}
                justifyContent={"center"}
              >
                {Array.from({ length: numberInLine }).map((_, index) => {
                  return (
                    <Skeleton
                      key={index}
                      w={`${100 / numberInLine - 2}%`}
                      lines={1}
                      borderRadius={10}
                      height={8}
                    />
                  );
                })}
              </HStack>
            );
          })}
        </VStack>
      </HStack>
    </View>
  );
}

export default SkeletonTable;
