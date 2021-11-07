/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Card, Empty, message, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { ActionMeta } from "react-select";
import CreatableSelect from "react-select/creatable";
import EmojiHeader from "../components/common/EmojiHeader";
import PageContainer from "../components/common/PageContainer";
import { useStoreDispatch, useStoreState } from "../store/hooks";
import { Item } from "../types/items";
import { ListItem } from "../types/lists";
import { API_URL } from "../utils/constants";

const Home: React.FC = () => {
  const dispatch = useStoreDispatch();
  const items = useStoreState((state) => state.items.items);
  const defaultList = useStoreState((state) => state.lists.defaultList);

  const [value, setValue] = useState<Item | null>();
  const [removeLoading, setRemoveLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [addLoading, setAddLoading] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    let localWs: WebSocket | null = null;
    async function connect() {
      const wsResp = await dispatch.lists.defaultListWs();
      localWs = wsResp as WebSocket;
      ws.current = wsResp as WebSocket;
      ws.current.onerror = (e) => {
        console.log("ws error", e);
      };
      ws.current.onmessage = (e) => {
        console.log("new ws message", e);
      };
    }
    connect();
    return () => {
      localWs?.close();
    };
  });

  const handleError = (error: unknown) => {
    // eslint-disable-next-line no-console
    console.log({ error });
    message.error(JSON.stringify(error));
  };

  const addItem = async (item: Item | null) => {
    if (defaultList && item) {
      const error = await dispatch.lists.addToList({ list: defaultList, item });
      if (error) {
        handleError(error);
      }
    }
  };

  const removeItem = async (listItem: ListItem) => {
    if (defaultList) {
      setRemoveLoading((state) => ({ ...state, [listItem.id]: true }));
      const error = await dispatch.lists.removeFromList({
        list: defaultList,
        listItem,
      });

      if (error) {
        handleError(error);
      }
      setRemoveLoading((state) => ({ ...state, [listItem.id]: false }));
    }
  };

  const autoCompleteSelect = async ({
    itemId,
    itemName,
  }: {
    itemId?: string;
    itemName?: string;
  }) => {
    setAddLoading(true);
    const item = items.find((x) => x.id === itemId);
    if (item) {
      await addItem(item);
      setValue(null);
    } else if (itemName) {
      const [addedItem, error] = await dispatch.items.addItem({
        name: itemName,
      });
      if (error) {
        handleError(error);
      } else if (addedItem) {
        await addItem(addedItem);
        setValue(null);
      }
    }
    setAddLoading(false);
  };

  const handleOnChange = async (
    newValue: Item | null,
    actionMeta: ActionMeta<any>
  ) => {
    setValue(newValue);
    if (newValue) {
      await autoCompleteSelect({
        itemId: newValue.id,
        itemName: newValue.name,
      });
    }
  };

  const handleOnCreate = async (newValue: string) => {
    newValue = newValue?.trim();
    if (newValue) {
      await autoCompleteSelect({
        itemName: newValue.trim(),
      });
    }
  };

  return (
    <>
      <PageContainer className="mx-auto max-w-3xl">
        <EmojiHeader
          src="/img/emoji/memo.svg"
          title={defaultList?.name ?? "No default list chosen yet"}
        />

        <div className="mb-2">
          <Spin spinning={addLoading}>
            <CreatableSelect
              isClearable
              isDisabled={addLoading}
              onChange={handleOnChange}
              onCreateOption={handleOnCreate}
              value={value}
              options={items}
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt.id}
              getNewOptionData={(inVal, optionLabel) => ({
                id: "",
                name: inVal,
                createdAt: "",
                ownerId: "",
                updatedAt: "",
              })}
            />
          </Spin>
        </div>

        {!defaultList?.items?.length ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No items" />
        ) : (
          <div className="space-y-2">
            {defaultList?.items
              ?.sort((a, b) => Number(a.crossed) - Number(b.crossed))
              .map((item, i) => (
                <Spin
                  key={item.id}
                  size="small"
                  spinning={removeLoading[item.id] ?? false}
                >
                  <Card
                    size="small"
                    onClick={() => removeItem(item)}
                    style={{
                      fontSize: "1.2rem",
                    }}
                  >
                    <div
                      style={
                        item.crossed
                          ? {
                              textDecoration: "line-through",
                              textDecorationStyle: "solid",
                              textDecorationThickness: "3px",
                              textDecorationColor: "#34D399",
                            }
                          : {}
                      }
                    >
                      {item.item.name}
                    </div>
                  </Card>
                </Spin>
                // <div key={i} className="flex flex-row space-x-2">
                //   <div>{item.item.name}</div>
                //   <Button
                //     loading={removeLoading}
                //     type="primary"
                //     onClick={() => removeItem(item)}
                //   >
                //     Remove
                //   </Button>
                // </div>
              ))}
          </div>
        )}
      </PageContainer>
    </>
  );
};

export default Home;
