import {
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
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import shallow from "zustand/shallow";
import { useAppPage, View } from "../hooks/app-page";
import { useGetData } from "../hooks/api";
import { useStore } from "../store/store";
import { Children } from "../types/children";
import { Loading } from "./loading";

export const Layout: React.FC<Children> = (props) => {
  return (
    <VStack display="flex" flexDir="column" height="100%" overflowY="hidden">
      <Header />
      <Container
        flex="1 1 auto"
        height="calc(100vh - (80px) - 1rem)"
        overflowY="scroll"
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
  const { isLoading } = useGetData();
  const [defaultList, lists] = useStore(
    (state) => [state.defaultList, state.lists],
    shallow
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container justifySelf="flex-start" backgroundColor="#cdcdcd">
      <Flex width="100%" justifyContent={"space-between"}>
        <Box>
          <Menu autoSelect={false}>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {defaultList.isLoading ? (
                <Loading />
              ) : (
                defaultList?.data?.name ?? "Shopping lists"
              )}
            </MenuButton>
            <MenuList>
              {lists?.data.map((list) => (
                <MenuItem
                  backgroundColor={
                    list.id === defaultList.data?.id ? "green.50" : undefined
                  }
                  key={list.id}
                >
                  {list.name}
                </MenuItem>
              ))}
              <MenuItem color="green.500" isDisabled={defaultList.isLoading}>
                Create new
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Box>
          <Menu>
            <MenuButton as={IconButton} icon={<SettingsIcon />} />
            <MenuList>
              <MenuItem isDisabled={defaultList.isLoading} icon={<EditIcon />}>
                Rename
              </MenuItem>
              <MenuItem isDisabled={defaultList.isLoading} icon={<CheckIcon />}>
                Remove crossed item
              </MenuItem>
              <MenuItem
                isDisabled={defaultList.isLoading}
                icon={<CheckIcon color="green.500" />}
              >
                Remove all items
              </MenuItem>
              <MenuItem
                isDisabled={defaultList.isLoading}
                icon={<DeleteIcon color="red.500" />}
              >
                Delete shopping list
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Container>
  );
};

const Footer: React.FC = () => {
  const { view, setView } = useAppPage();
  const activeColor = (v: View) => (v === view ? "green.400" : undefined);
  return (
    <Container justifySelf="flex-end" backgroundColor="#cdcdcd">
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
