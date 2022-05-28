import { useStore } from "../../store/store";
import { Loading } from "../loading";
const ItemsPage: React.FC = () => {
  const { isLoading, data } = useStore((state) => state.items);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsPage;
