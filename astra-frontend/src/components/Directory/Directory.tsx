import { Key } from "react";
import "../Directory/Directory.styles.scss";
import DirectoryItem from "../DirectoryItem/DirectoryItem";

export type DirectoryCategory = {
  id: Key;
  title: string;
  imageUrl: string;
  route: string;
};

const categories: DirectoryCategory[] = [
  {
    id: 1,
    title: "Games",
    imageUrl:
      "https://gizmodo.com/app/uploads/2020/03/ut4jjndnf69kxcjaervj.jpg",
    route: "shop/gamestore",
  },
  {
    id: 2,
    title: "hats",
    imageUrl: "https://i.ibb.co/cvpntL1/hats.png",
    route: "shop/hats",
  },
  {
    id: 3,
    title: "jackets",
    imageUrl: "https://i.ibb.co/px2tCc3/jackets.png",
    route: "shop/jackets",
  },
  {
    id: 4,
    title: "sneakers",
    imageUrl: "https://i.ibb.co/0jqHpnp/sneakers.png",
    route: "shop/sneakers",
  },
  {
    id: 5,
    title: "womens",
    imageUrl: "https://i.ibb.co/GCCdy8t/womens.png",
    route: "shop/womens",
  },
  {
    id: 6,
    title: "mens",
    imageUrl: "https://i.ibb.co/R70vBrQ/men.png",
    route: "shop/mens",
  },
];

const Directory = () => {
  return (
    <div className="directory-container">
      {categories.map((item) => (
        <DirectoryItem key={item.id} category={item} />
      ))}
    </div>
  );
};

export default Directory;
