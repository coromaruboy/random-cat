import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

const IndexPage: NextPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImage().then((newImage) => {
      setImageUrl(newImage.url);
      setLoading(false);
    })
  }, []);// 第二引数に[]を指定することで、コンポーネントがマウントされたときのみ実行する

  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };
  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>他のにゃんず</button>
      <div className={styles.frame}>{loading || <img src={imageUrl} className={styles.img} />}</div>
    </div>
  );
}

export default IndexPage

type Image = {
  url: string;
}

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images: unknown = await res.json();
  // 配列として表現されているか
  if (!Array.isArray(images)) {
    throw new Error("猫の画像が取得できませんでした。");
  }
  const image: unknown = images[0];
  // Imageの構造をしているか
  if (!isImage(image)) {
    throw new Error("猫の画像が取得できませんでした。")
  }
  return image;
};

const isImage = (value: unknown): value is Image => {
  if (!value || typeof value !== "object") {
    return false;
  }
  return "url" in value && typeof value.url === "string";
}
