import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import shallow from "zustand/shallow";
import { useStore } from "../../store/store";
import { ListItem } from "../../types/api-response";
import { Loading } from "../loading";

const HomePage: React.FC = () => {
  const { isLoading: defaultListIsLoading, data: defaultList } = useStore(
    (state) => state.defaultList
  );

  const [updateListItem, addItemToList] = useStore(
    (state) => [state.updateListItem, state.addItemToList],
    shallow
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<any>();

  const [inputItemName, setInputItemName] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputItemName) {
      addItemToList(inputItemName);
      setInputItemName("");
    }
  };

  const countedItems: (ListItem & { count: number })[] = [];
  for (const listItem of defaultList?.items ?? []) {
    const existingCountedItem = countedItems.find(
      (x) => x.itemId === listItem.itemId
    );
    if (existingCountedItem) {
      existingCountedItem.count = existingCountedItem.count + 1;
    } else {
      countedItems.push({
        ...listItem,
        count: 1,
      });
    }
  }

  return (
    <Flex flexDir={"column"} justifyContent="space-between" width="100%">
      <Flex flexDir="column">
        {defaultListIsLoading && <Loading />}
        {countedItems.map((item) => (
          <Box key={item.id} onClick={() => updateListItem("delete", item)}>
            <Text fontWeight={"bold"}>
              {item.item.name}
              {item.count > 1 && (
                <Badge ml="1" colorScheme="green">
                  {item.count}
                </Badge>
              )}
            </Text>
          </Box>
        ))}
      </Flex>
      <Button ref={btnRef} onClick={onOpen}>
        Add
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <form onSubmit={(e) => onSubmit(e)}>
              <Flex>
                <Input
                  mr="2"
                  placeholder="Item..."
                  value={inputItemName}
                  onChange={(e) => setInputItemName(e.target.value)}
                />
                <Button type="submit">
                  <AddIcon />
                </Button>
              </Flex>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
export default HomePage;
