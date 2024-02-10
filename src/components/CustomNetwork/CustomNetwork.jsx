import "antd/dist/antd.css";
import _ from "lodash";
import { Button, Input, Select, Spin } from "antd";
import { ReactComponent as IconSelect } from "../../assets/icons/code.svg";
import { ReactComponent as IconChain } from "../../assets/icons/chain.svg";
import { useEffect, useState } from "react";
import { MyDropZone } from "..";

const { Option } = Select;

const CustomNetwork = ({ updateChain }) => {
  const [defaultChainName, setDefaultChainName] = useState(window.chainStore.current.chainName);
  const [chainInfos, setChainInfos] = useState(window.chainStore.chainInfos);
  const [jsonFile, setJsonFile] = useState({});
  const [jsonFileName, setJsonFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  const handleJsonFile = (file) => {
    setJsonFile(file.content);
    setJsonFileName(file.fileName);
    setUpdateMessage("");
  };

  const onAddChain = () => {
    try {
      setErrorMessage("");
      console.log("json file: ", jsonFile);
      if (jsonFile.chainId) {
        window.chainStore.addChain(jsonFile);
        // set chain to auto trigger new chain store
        setChainInfos(window.chainStore.chainInfos);
        setUpdateMessage("Successfully added the new chain");
      } else throw "Invalid chain data";
    } catch (error) {
      setErrorMessage(String(error));
      setUpdateMessage("");
    }
  };

  const onRemoveChain = () => {
    try {
      setErrorMessage("");
      if (jsonFile.chainId) {
        // check if current chain id is the removed one. if yes => reset current chain id to the first chain id in list
        const currentChainId = window.chainStore.current.chainId;
        if (currentChainId === jsonFile.chainId) {
          let chainName = window.chainStore.chainInfos[0].chainName;
          window.chainStore.setChain(chainName);
          updateChain(chainName);
          window.location.reload();
        }
        window.chainStore.removeChain(jsonFile.chainId);
        // set chain to auto trigger new chain store
        setChainInfos(window.chainStore.chainInfos);
        window.chainStore.setChain(window.chainStore.current.chainName);
        setUpdateMessage("Successfully removed the provided chain");
      } else throw "invalid chain data";
    } catch (error) {
      setErrorMessage(String(error));
      setUpdateMessage("");
    }
  };

  return (
    <div className="chain-select">
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconChain
          style={{
            width: "16px",
            height: "16px",
            marginRight: "5px",
            marginBottom: "8px",
          }}
        />
        <h3> Select chain name</h3>
      </div>
      <Select
        defaultValue={defaultChainName}
        style={{ width: 240 }}
        suffixIcon={<IconSelect />}
        onSelect={(value) => {
          console.log("on select change chain data")
          window.chainStore.setChain(value);
          updateChain(value);
          // setChainName(value);
          // setGasPrice(window.chainStore.current.gasPriceStep?.average ? window.chainStore.current.gasPriceStep.average.toString() : "0");
          // setGasDenom(window.chainStore.current.feeCurrencies[0].coinMinimalDenom);
        }}
      >
        {chainInfos.map((info) => (
          <Option key={info.chainName} value={info.chainName}>
            {info.chainName}
          </Option>
        ))}
      </Select>
      <div className="chain-management">
        <div className="update-chain">
          <Button onClick={onAddChain} className="primary-button">
            Add new chain
          </Button>
          <Button onClick={onRemoveChain} className="remove-button">
            Remove chain
          </Button>
        </div>
        {_.isEmpty(jsonFile) && (
          <div
            style={{
              display: "flex",
              cursor: "pointer",
              fontFamily: "Courier",
            }}
          >
            <MyDropZone
              setSchema={null}
              setJson={handleJsonFile}
              dropZoneText={
                "Upload the chain info json file here to add / remove chain"
              }
            />
          </div>
        )}
        {jsonFileName && (
          <div>
            <div
              style={{
                display: "flex",
                color: "#c4c6c9",
                fontFamily: "Courier",
                paddingBottom: "8px",
              }}
            >
              {`file name: ${jsonFileName}`}
            </div>
            <Button
              onClick={() => {
                setJsonFile({});
                setJsonFileName("");
                setUpdateMessage("");
                setErrorMessage("");
              }}
              className="remove-secondary"
            >
              Remove json chain
            </Button>
          </div>
        )}
        {errorMessage && (
          <div className="contract-address">
            <span style={{ color: "red" }}>Error message </span>
            <p>{errorMessage}</p>
          </div>
        )}
        {updateMessage && (
          <div className="contract-address">
            <p>{updateMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomNetwork;
