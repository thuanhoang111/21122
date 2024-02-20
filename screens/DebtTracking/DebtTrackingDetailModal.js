import { Button, HStack, Heading, Modal, Text, VStack } from "native-base";
import { Dimensions, StyleSheet, useWindowDimensions } from "react-native";
import { heightOfScreen, widthOfScreen } from "../../constants/ConstantMain";
import Carousel, { Pagination } from "react-native-snap-carousel";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { formatMoneyToVN } from "../../constants/ConstantFunc";
import { useState } from "react";
function DebtTrackingDetailModal({
  listAccount = [],
  documentCode = "",
  speech = "",
  date = "",
  isOpen,
  onClose,
}) {
  const titleAccount = ["Bên nợ", "Bên có"];
  const [page, setPage] = useState(0);
  const renderItem = ({ item, index }) => {
    return (
      <VStack borderColor={"amber.300"} borderWidth={1} p={2} borderRadius={10}>
        <VStack space={2} width={"100%"}>
          <HStack alignItems={"center"}>
            <Text style={styles.titleModal}>Mã chứng từ: </Text>
            <Text italic>{documentCode}</Text>
          </HStack>
          <HStack alignItems={"center"}>
            <Text style={styles.titleModal}>Ngày nhập chứng từ: </Text>
            <Text italic>{date}</Text>
          </HStack>
          <HStack alignItems={"center"}>
            <Text style={styles.titleModal}>Ngày chứng từ: </Text>
            <Text italic>{date}</Text>
          </HStack>
          <HStack alignItems={"flex-start"}>
            <Text style={styles.titleModal}>Diễn giả chứng từ: </Text>
            <Text italic numberOfLines={2} flex={1}>
              {speech}
            </Text>
          </HStack>
        </VStack>
        {/* Account Type */}
        <Heading textAlign={"center"} fontSize={"md"}>
          {titleAccount[index]}
        </Heading>
        <VStack space={2}>
          <HStack alignItems={"center"}>
            <HStack alignItems={"center"}>
              <EvilIcons name="sc-telegram" />
              <Text style={styles.titleModal}>Số tiền: </Text>
            </HStack>
            <Text>{formatMoneyToVN(item.Money, "đ")}</Text>
          </HStack>
          <HStack alignItems={"center"}>
            <HStack alignItems={"center"}>
              <EvilIcons name="sc-telegram" />
              <Text style={styles.titleModal}>Số thuế: </Text>
            </HStack>
            <Text>{formatMoneyToVN(item.TaxMoney, "đ")}</Text>
          </HStack>
          <HStack alignItems={"center"}>
            <HStack alignItems={"center"}>
              <EvilIcons name="sc-telegram" />
              <Text style={styles.titleModal}>Tổng cộng: </Text>
            </HStack>
            <Text>{formatMoneyToVN(item.TotalMoney, "đ")}</Text>
          </HStack>
          <HStack alignItems={"flex-start"} width={"100%"}>
            <HStack alignItems={"center"}>
              <EvilIcons name="sc-telegram" />
              <Text style={styles.titleModal}>Tài Khoản: </Text>
            </HStack>
            <Text flex={1}>{item.AccountName}</Text>
          </HStack>
          <HStack alignItems={"flex-start"}>
            <HStack alignItems={"center"}>
              <EvilIcons name="sc-telegram" />
              <Text style={styles.titleModal}>Tài khoản chi tiết: </Text>
            </HStack>
            <Text flex={1}>{item.AccountDetail}</Text>
          </HStack>
        </VStack>
      </VStack>
    );
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"full"}
      justifyContent={"center"}
      paddingX={"5%"}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Chi tiết chứng từ</Modal.Header>
        <Modal.Body>
          <VStack alignItems={"center"}>
            <Carousel
              data={listAccount}
              renderItem={renderItem}
              sliderWidth={widthOfScreen * 0.8}
              itemWidth={widthOfScreen * 0.7}
              keyExtractor={(item, index) => index}
              autoplay
              firstItem={1}
              onScrollIndexChanged={(index) => setPage(index)}
              slideStyle={{ backgroundColor: "white" }}
              layout="default"
              activeSlideAlignment="center"
            />
            {/* <Pagination
                dotsLength={2}
                activeDotIndex={page}
                containerStyle={{ padding: 0 }}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              /> */}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
              Trở lại
            </Button>
            <Button onPress={onClose}>Xác nhận</Button>
          </Button.Group> */}
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
const styles = StyleSheet.create({
  titleModal: {
    color: "#737373",
    fontWeight: 500,
  },
});
export default DebtTrackingDetailModal;
