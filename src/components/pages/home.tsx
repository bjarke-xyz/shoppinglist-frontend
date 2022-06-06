import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Input,
  Text,
  useDisclosure,
  useMenuItem,
  Wrap,
} from "@chakra-ui/react";
import { orderBy, take, xor } from "lodash";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import shallow from "zustand/shallow";
import { useStore } from "../../store/store";
import { ApiResponse, Item, ListItem } from "../../types/api-response";
import { http } from "../../utils/http";
import { Loading } from "../loading";

type CountedListItem = ListItem & { count: number };

function countItems(items: ListItem[]): CountedListItem[] {
  const countedItems: CountedListItem[] = [];
  for (const listItem of items) {
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
  return countedItems;
}

const HomePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { isLoading: defaultListIsLoading, data: defaultList } = useStore(
    (state) => state.defaultList
  );

  const { isLoading: itemsIsLoading, data: items } = useStore(
    (state) => state.items
  );

  const [setDefualtList] = useStore((state) => [state.setDefaultList], shallow);

  const addItemToListMutation = useMutation(
    async (itemName: string) => {
      if (!defaultList) {
        return;
      }
      let item = (items || []).find(
        (x) => x.name.toLowerCase() == itemName.toLowerCase()
      );
      if (!item) {
        const resp = await http.post(`items`, {
          name: itemName,
        });
        if (!resp.ok) {
          toast.error("Error creating item");
          return;
        }
        queryClient.invalidateQueries("items.get");
        const createdItem: ApiResponse<Item> = await resp.json();
        item = createdItem.data;
      }
      if (!item) {
        toast.error("Error adding item");
        return;
      }
      return (await (
        await http.post(`lists/${defaultList.id}/items/${item.id}`)
      ).json()) as ApiResponse<ListItem>;
    },
    {
      onSuccess: (data) => {
        if (data?.data && defaultList) {
          defaultList.items.push(data.data);
          setDefualtList({
            data: defaultList,
            isLoading: defaultListIsLoading,
          });
        }
      },
    }
  );

  const updateListItemMutation = useMutation(
    async ({
      listItem,
      action,
    }: {
      listItem: ListItem;
      action: "cross" | "uncross";
    }) => {
      if (!defaultList) {
        return;
      }
      const resp = await http.put(
        `lists/${listItem.listId}/items/${listItem.id}`,
        { crossed: action == "cross" }
      );
      return (await resp.json()) as ApiResponse<ListItem>;
    },
    {
      onSuccess: (data) => {
        if (data?.data && defaultList) {
          const index = defaultList.items.findIndex(
            (x) => x.id === data.data.id
          );
          if (index !== -1) {
            defaultList.items[index] = data.data;
            setDefualtList({
              data: defaultList,
              isLoading: defaultListIsLoading,
            });
          }
        }
      },
    }
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<any>();

  const [inputItemName, setInputItemName] = useState("");
  const setInputItemNameWrapper = (val: string) => {
    setInputItemName(val);
    let suggestedItems = items;
    if (val) {
      suggestedItems = items.filter((x) =>
        x.name.toLowerCase().includes(val.toLowerCase())
      );
    }
    setSuggestions(take(suggestedItems, 5));
  };

  const [suggestions, setSuggestions] = useState<Item[]>([]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputItemName) {
      addItemToListMutation.mutate(inputItemName);
      setInputItemName("");
    }
  };

  const addSuggestion = (item: Item) => {
    addItemToListMutation.mutate(item.name);
  };

  const crossedItems = (defaultList?.items ?? []).filter((x) => x.crossed);
  const uncrossedItems = (defaultList?.items ?? []).filter((x) => !x.crossed);

  const crossedCountedItems = orderBy(
    countItems(crossedItems),
    (x) => x.updatedAt,
    "desc"
  );
  const uncrossedCountedItems = orderBy(
    countItems(uncrossedItems),
    (x) => x.updatedAt,
    "desc"
  );

  const listItems = [...uncrossedCountedItems, ...crossedCountedItems];
  return (
    <Flex flexDir={"column"} justifyContent="space-between" width="100%">
      <Flex flexDir="column">
        {defaultListIsLoading || (itemsIsLoading && <Loading />)}
        {!defaultListIsLoading && listItems.length === 0 && (
          <p>Add an item to your shopping list to get started</p>
        )}
        {listItems.map((listItem) => (
          <Box
            key={listItem.id}
            display="flex"
            paddingY="2"
            onClick={() =>
              updateListItemMutation.mutate({
                action: listItem.crossed ? "uncross" : "cross",
                listItem: listItem,
              })
            }
          >
            <Checkbox mr="2" isChecked={listItem.crossed}></Checkbox>
            <Text
              borderBottom="1px"
              borderColor="gray.400"
              flex="1"
              fontWeight={"bold"}
              fontSize="lg"
            >
              {listItem.item.name}
              {listItem.count > 1 && (
                <Badge ml="1" colorScheme="green">
                  {listItem.count}
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
              <Flex direction="column">
                <Wrap mb="2">
                  {suggestions.map((item) => (
                    <Button
                      m="2"
                      key={item.id}
                      onClick={() => addSuggestion(item)}
                    >
                      {item.name}
                    </Button>
                  ))}
                </Wrap>
                <Flex>
                  <Input
                    mr="2"
                    placeholder="Item..."
                    value={inputItemName}
                    isDisabled={addItemToListMutation.isLoading}
                    onChange={(e) => setInputItemNameWrapper(e.target.value)}
                  />
                  <Button
                    type="submit"
                    isLoading={addItemToListMutation.isLoading}
                  >
                    <AddIcon />
                  </Button>
                </Flex>
              </Flex>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
export default HomePage;
