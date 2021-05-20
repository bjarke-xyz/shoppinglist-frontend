/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import _ from "lodash";
import { AutoComplete, Button, Spin, Card, Empty } from "antd";
import PageContainer from "../components/common/PageContainer";
import EmojiHeader from "../components/common/EmojiHeader";
import { useStoreDispatch, useStoreState } from "../store/hooks";
import { ListItem, UpdateList } from "../types/lists";
import { Item } from "../types/items";

const Home: React.FC = () => {
  const dispatch = useStoreDispatch();
  const items = useStoreState((state) => state.items.items);
  const defaultList = useStoreState((state) => state.lists.defaultList);

  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [removeLoading, setRemoveLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [addLoading, setAddLoading] = useState(false);

  const handleError = (error: unknown) => {
    console.log({ error });
    alert(JSON.stringify(error));
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
      setAutoCompleteValue("");
    } else if (itemName) {
      const [addedItem, error] = await dispatch.items.addItem({
        name: itemName,
      });
      if (error) {
        handleError(error);
      } else if (addedItem) {
        await addItem(addedItem);
        setAutoCompleteValue("");
      }
    }
    setAddLoading(false);
  };

  const autoCompleteKeyDown = async (e: React.KeyboardEvent) => {
    const item = items.find((x) => x.name === autoCompleteValue);
    if (e.key === "Enter") {
      await autoCompleteSelect({
        itemName: autoCompleteValue,
        itemId: item?.id,
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
            <AutoComplete
              autoFocus
              filterOption
              backfill
              disabled={addLoading}
              value={autoCompleteValue}
              onChange={(value) => setAutoCompleteValue(value)}
              className="w-full"
              options={items.map((x) => ({
                label: x.name,
                value: x.name,
                key: x.id,
              }))}
              onSelect={(value, option) =>
                autoCompleteSelect({
                  itemId: option.key?.toString(),
                  itemName: value,
                })
              }
              onKeyDown={(e) => autoCompleteKeyDown(e)}
            />
          </Spin>
        </div>

        {!defaultList?.items?.length ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
