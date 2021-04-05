/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import _ from "lodash";
import Downshift from "downshift";
import Card from "../components/common/Card";
import EmojiHeader from "../components/common/EmojiHeader";
import { useStoreDispatch, useStoreState } from "../store/hooks";
import { ListItem, UpdateList } from "../types/lists";
import { Item } from "../types/items";

interface ISearchBarProps {
  items: Item[];
  onChange: (selection: Item | null) => void
}
const SearchBar: React.FC<ISearchBarProps> = (props) => (
  <Downshift<Item>
    onChange={(selection, stateAndHelpers) => {
      props.onChange(selection)
      stateAndHelpers.clearSelection();
    }}
    itemToString={(item) => (item ? item.name : '')}
  >
    {({
      getInputProps,
      getItemProps,
      getMenuProps,
      getLabelProps,
      getToggleButtonProps,
      itemToString,
      inputValue,
      highlightedIndex,
      selectedItem,
      isOpen,
    }) => (
      <div className="inline-block ml-2">
        <label {...getLabelProps()}>Enter a fruit:</label>
        <input {...getInputProps()} />
        <button type="button" {...getToggleButtonProps()} aria-label="toggle menu">
          &#8595;
        </button>
        <ul {...getMenuProps()} className="max-h-20 max-w-md overflow-y-scroll bg-gray-300 p-0 list-none relative">
          {isOpen &&
            props.items
              .filter((item) => !inputValue || itemToString(item).toLowerCase().includes(inputValue.toLowerCase()))
              .map((item, index) => (
                <li
                  {...getItemProps({
                    key: `${itemToString(item)}${index}`,
                    item,
                    index,
                    style: {
                      backgroundColor:
                        highlightedIndex === index ? 'lightgray' : 'white',
                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                    },
                  })}
                >
                  {itemToString(item)}
                </li>
              ))}
        </ul>
      </div>
    )}
  </Downshift>
);

const Home: React.FC = () => {
  const dispatch = useStoreDispatch();
  const items = useStoreState((state) => state.items.items);
  const defaultList = useStoreState((state) => state.lists.defaultList);

  const addItem = async (item: Item | null) => {
    console.log(item)
    if (defaultList && item) {
      const error = await dispatch.lists.addToList({ list: defaultList, item });
      if (error) {
        console.log({ error });
        alert(JSON.stringify(error));
      }
    }
  };

  const removeItem = async (listItem: ListItem) => {
    if (defaultList) {
      const error = await dispatch.lists.removeFromList({
        list: defaultList,
        listItem,
      });

      if (error) {
        console.log({ error });
        alert(JSON.stringify(error));
      }
    }
  };

  return (
    <>
      <Card className="mx-auto max-w-3xl">
        <EmojiHeader
          src="/img/emoji/memo.svg"
          title={defaultList?.name ?? "No default list chosen yet"}
        />

        <SearchBar items={items} onChange={addItem} />

        {defaultList?.items?.map((item, i) => (
          <div key={i} className="flex flex-row space-x-2">
            <div>{item.item.name}</div>
            <button type="button" onClick={() => removeItem(item)}>
              remove
            </button>
          </div>
        ))}
      </Card>
    </>
  );
};

export default Home;
