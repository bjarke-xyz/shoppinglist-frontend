import dayjs from "dayjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Alert from "../components/common/Alert";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmojiHeader from "../components/common/EmojiHeader";
import { PlusIcon } from "../components/common/Icons";
import Input from "../components/common/Input";
import { ListContainer, ListItem } from "../components/common/List";
import { useStoreDispatch, useStoreState } from "../store/hooks";
import { AddList, List, UpdateList } from "../types/lists";

interface IListItemWrapperProps {
  list: List;
}
const ListItemWrapper: React.FC<IListItemWrapperProps> = ({ list }) => {
  const dispatch = useStoreDispatch();
  const deleteList = async () => {
    const error = await dispatch.lists.removeList(list);
    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      return false;
    }
    return true;
  };

  const {
    register,
    handleSubmit,
    errors,
    getValues,
    setValue,
  } = useForm<UpdateList>();

  const saveList = async () => {
    if (errors.name) {
      return false;
    }
    const updateList: UpdateList = { ...getValues(), id: list.id };
    const error = await dispatch.lists.updateList(updateList);
    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      setValue("name", list.name);
      return false;
    }
    return true;
  };

  const onSubmit = handleSubmit(async (formData) => {
    await saveList();
  });

  return (
    <ListItem
      title={list.name}
      subtitle={dayjs(list.createdAt).format("DD/MM/YYYY")}
      onDeleteClick={() => deleteList()}
      onSaveClick={() => saveList()}
      modalChildren={
        <form onSubmit={onSubmit}>
          <Input
            defaultValue={list.name}
            type="text"
            label="Name"
            name="name"
            reg={register({ required: true })}
            errors={errors.name}
          />
          <Input
            defaultChecked={list.default}
            type="checkbox"
            label="Default list"
            name="default"
            reg={register()}
            errors={errors.default}
          />
        </form>
      }
    />
  );
};

const Lists: React.FC = () => {
  const lists = useStoreState((state) => state.lists.lists);
  const dispatch = useStoreDispatch();
  const { register, handleSubmit, errors, setValue } = useForm<AddList>();
  const [apiError, setApiError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setAddLoading(true);
    const error = await dispatch.lists.addList(formData);
    if (error) {
      setApiError(error.error);
    } else {
      setApiError("");
      setValue("name", "");
    }
    setAddLoading(false);
  });

  return (
    <>
      <Card className="mx-auto max-w-3xl">
        <EmojiHeader src="/img/emoji/spiral-notepad.svg" title="Your lists" />

        <div className="space-y-2">
          {apiError && (
            <Alert color="red" title="Error" body={apiError} className="mb-4" />
          )}
          <form onSubmit={onSubmit} className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input
                label="Name"
                name="name"
                type="text"
                reg={register({ required: true })}
                errors={errors.name}
                className="my-0"
              />
            </div>
            <div className="col-span-1">
              <Button
                loading={addLoading}
                label="Add"
                icon={PlusIcon}
                onClick={onSubmit}
                type="submit"
              />
            </div>
          </form>

          <ListContainer>
            {lists.map((list) => (
              <ListItemWrapper key={list.id} list={list} />
            ))}
          </ListContainer>
        </div>
      </Card>
    </>
  );
};

export default Lists;
