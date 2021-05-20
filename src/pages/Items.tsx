import dayjs from "dayjs";
import React from "react";
import PageContainer from "../components/common/PageContainer";
import EmojiHeader from "../components/common/EmojiHeader";
import { ListContainer, ListItem } from "../components/common/List";
import { useStoreDispatch, useStoreState } from "../store/hooks";
import { Item } from "../types/items";

const Items: React.FC = () => {
  const items = useStoreState((state) => state.items.items);
  const dispatch = useStoreDispatch();

  const deleteItem = async (item: Item) => {
    const error = await dispatch.items.removeItem(item);
    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      return false;
    }
    return true;
  };

  const saveItem = async (item: Item) => {
    await new Promise((r) => setTimeout(r, 500));
    return true;
  };

  return (
    <>
      <PageContainer className="mx-auto max-w-3xl">
        <EmojiHeader src="/img/emoji/bread.svg" title="Your items" />

        <ListContainer>
          {items.map((item, i) => (
            <ListItem
              key={i}
              title={item.name}
              subtitle={dayjs(item.createdAt).format("DD/MM/YYYY")}
              onDeleteClick={() => deleteItem(item)}
              onSaveClick={() => saveItem(item)}
              modalChildren={<div>TODO: edit name</div>}
            />
          ))}
        </ListContainer>
      </PageContainer>
    </>
  );
};

export default Items;
