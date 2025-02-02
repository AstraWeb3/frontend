import { DirectoryCategory } from "../Directory/Directory";
import "./DirectoryItem.styles.scss";
import Link from "next/link";

type DirectoryItemProps = {
  category: DirectoryCategory;
};
// client-side navigation.
const DirectoryItem = ({ category }: DirectoryItemProps) => {
  const { imageUrl, title, route } = category;

  return (
    <div className="directory-item-container">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="body">
        <Link href={`/${route}`} className="text-blue-500 hover:underline">
          {title}
        </Link>
        <p>Shop Now</p>
      </div>
    </div>
  );
};

export default DirectoryItem;
