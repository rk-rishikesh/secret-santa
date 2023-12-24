import { createContext, useContext, useState } from "react";
import { NFTStorage, File } from "nft.storage";

const IPFSContext = createContext({});

export function IPFSContextProvider(props) {
  const [IPFSuploading, setIPFSuploading] = useState(false);
  const [IPFSerror, setIPFSerror] = useState(null);

  async function IPFSupload(data, imageData) {
    try {
      setIPFSerror(null);
      setIPFSuploading(true);
      const client = new NFTStorage({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYxMjRGNzViYzgwMWE1MmVENTkxQzRBNjVkRWVjMEUxMkVjZTgxRGEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NDEzMDQ4NzAyMiwibmFtZSI6IjNFc3RhdGVzIn0.6GtIH1dEXlOzT4YyTdTQaltFLtuMhn5fWLZrPZ_xthY",
      });

      // console.log(new File([file], file.name, { type: file.type }));
      const metadata = await client.store({
        name: data.name,
        description: data.description,
        image: imageData,
      });
      console.log(metadata);
      return metadata.url;
    } catch (error) {
      console.error(error);
      setIPFSerror(error);
    } finally {
      setIPFSuploading(false);
    }
  }

  return (
    <IPFSContext.Provider value={{ IPFSuploading, IPFSerror, IPFSupload }}>
      {props.children}
    </IPFSContext.Provider>
  );
}

export function useIPFS() {
  return useContext(IPFSContext);
}
