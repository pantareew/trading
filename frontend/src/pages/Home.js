import { Hero, Assets } from "../components";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:8000/assets")
      .then((res) => {
        const assets = res.data.map((asset) => ({
          id: asset.id,
          title: asset.name,
          price: `${asset.eth} ETH`,
          image: asset.img,
        }));
        setData(assets);
      })
      .catch((err) => console.error("Error fetching data: ", err));
  }, []);
  return (
    <div>
      <Hero />
      {data && <Assets heading="Explore Assets" items={data} />}
    </div>
  );
}
