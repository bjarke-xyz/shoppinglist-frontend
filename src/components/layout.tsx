import {
  AddIcon,
  CheckIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import shallow from "zustand/shallow";
import { useAppPage, View } from "../hooks/app-page";
import { useGetData } from "../hooks/api";
import { useStore } from "../store/store";
import { Children } from "../types/children";
import { Loading } from "./loading";
import { useMutation, useQueryClient } from "react-query";
import { List } from "../types/api-response";
import { http } from "../utils/http";
import toast from "react-hot-toast";
import { FormEvent, useRef, useState } from "react";
import { useUserDetails } from "../hooks/user";

export const Layout: React.FC<Children> = (props) => {
  return (
    <VStack
      display="flex"
      flexDir="column"
      height="100%"
      overflowY="hidden"
      backgroundImage="/charlie-brown.svg"
    >
      <Header />
      <Container
        flex="1 1 auto"
        height="calc(100vh - 8rem)"
        overflowY="auto"
        bgColor="white"
        padding="2"
        borderRadius="md"
        // border="1px solid black"
      >
        <Box height="100%" display="flex">
          {props.children}
        </Box>
      </Container>
      <Footer></Footer>
    </VStack>
  );
};

const Header: React.FC = () => {
  const userDetails = useUserDetails();
  const { isLoading } = useGetData();
  const [defaultList, lists] = useStore(
    (state) => [state.defaultList, state.lists],
    shallow
  );

  const queryClient = useQueryClient();

  const deleteCrossedMutation = useMutation(
    (list: List) => {
      const resp = http.delete(`lists/${list.id}/items/crossed`);
      return resp;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("lists.get");
        toast.success("Checked items removed");
      },
    }
  );

  const setDefaultListMutation = useMutation(
    (list: List) => {
      return http.put(`lists/${list.id}/default`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("lists.default.get");
      },
    }
  );

  const deleteListMutation = useMutation(
    (list: List) => {
      return http.delete(`lists/${list.id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("lists.get");
        queryClient.invalidateQueries("lists.default.get");
      },
    }
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<any>();

  const addNewListMutation = useMutation(
    (listName: string) => http.post(`lists`, { name: listName }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("lists.get");
        setNewListName("");
        onClose();
      },
    }
  );

  const [newListName, setNewListName] = useState("");
  const onNewListSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !newListName ||
      lists.data?.some(
        (x) => x.name.toLowerCase() === newListName.toLowerCase()
      )
    ) {
      return;
    }

    addNewListMutation.mutate(newListName);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container
      justifySelf="flex-start"
      backgroundColor="white"
      maxWidth="unset"
      boxShadow="md"
      padding="2"
    >
      <Flex width="100%" justifyContent={"space-between"}>
        <Box>
          <Menu autoSelect={false}>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {defaultList.isLoading ? (
                <Loading />
              ) : (
                defaultList?.data?.name ?? "Select or create list"
              )}
            </MenuButton>
            <MenuList>
              {lists?.data.map((list) => (
                <MenuItem
                  backgroundColor={
                    list.id === defaultList.data?.id ? "green.50" : undefined
                  }
                  key={list.id}
                  onClick={() =>
                    defaultList.data?.id !== list.id &&
                    setDefaultListMutation.mutate(list)
                  }
                >
                  {list.name}
                </MenuItem>
              ))}
              <MenuItem
                color="green.500"
                onClick={onOpen}
                isDisabled={defaultList.isLoading}
              >
                Create new
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Box>
          <Menu>
            <MenuButton as={IconButton} icon={<SettingsIcon />} />
            <MenuList>
              <MenuItem
                isDisabled={defaultList.isLoading}
                onClick={() => toast.success("TODO")}
                icon={<EditIcon />}
              >
                Rename
              </MenuItem>
              <MenuItem
                isDisabled={
                  defaultList.isLoading || deleteCrossedMutation.isLoading
                }
                onClick={() =>
                  defaultList.data &&
                  deleteCrossedMutation.mutate(defaultList.data)
                }
                icon={<CheckIcon />}
              >
                Remove checked items
              </MenuItem>
              <MenuItem
                isDisabled={defaultList.isLoading}
                onClick={() => toast.success("TODO")}
                icon={<CheckIcon color="green.500" />}
              >
                Remove all items
              </MenuItem>
              <MenuItem
                isDisabled={
                  defaultList.isLoading || deleteListMutation.isLoading
                }
                onClick={() =>
                  defaultList.data &&
                  deleteListMutation.mutate(defaultList.data)
                }
                icon={<DeleteIcon color="red.500" />}
              >
                Delete shopping list
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => userDetails.logout()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="top"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <form onSubmit={(e) => onNewListSubmit(e)}>
              <Flex>
                <Input
                  mr="2"
                  placeholder="List..."
                  value={newListName}
                  isDisabled={addNewListMutation.isLoading}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <Button type="submit" isLoading={addNewListMutation.isLoading}>
                  <AddIcon />
                </Button>
              </Flex>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

const Footer: React.FC = () => {
  const { view, setView } = useAppPage();
  const activeColor = (v: View) => (v === view ? "green.400" : undefined);
  return (
    <Container
      justifySelf="flex-end"
      backgroundColor="white"
      maxWidth="unset"
      padding="2"
    >
      <Flex justifyContent="space-evenly">
        <Button onClick={() => setView("home")} color={activeColor("home")}>
          Home
        </Button>
        <Button onClick={() => setView("items")} color={activeColor("items")}>
          Items
        </Button>
      </Flex>
    </Container>
  );
};
