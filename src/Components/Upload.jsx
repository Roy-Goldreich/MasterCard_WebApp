import React, { useState } from "react";
import axios from "axios";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorModal from "./ErrorModal";
import Button from "@mui/material/Button";
const Upload = () => {
  const [selectedFile, setSelectFile] = useState(null);
  const [fileType, setFileType] = useState("json2csv");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const baseUrl = "http://localhost:5000/convert";
  const onFileChanged = (event) => {
    setSelectFile(event.target.files[0]);
  };

  const handleToggleChange = (event, newToggleValue) => {
    if (newToggleValue !== null) setFileType(newToggleValue);
  };
  const downloadFile = (fileBlob, fileName, fileType) => {
    const url = window.URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.${fileType}`);
    document.body.appendChild(link);
    link.click();
    setIsLoading(false);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append(`file`, selectedFile, selectedFile.name);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    };

    let endpointUriComponent;
    let fileSuffix;
    if (fileType === "json2csv") {
      endpointUriComponent = "/json_to_csv";
      fileSuffix = "csv";
    } else {
      endpointUriComponent = "/csv_to_json";
      fileSuffix = "json";
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}${endpointUriComponent}`,
        formData,
        config
      );
      downloadFile(response.data, selectedFile.name.split(".")[0], fileSuffix);
    } catch (error) {
      setHasError(true);
    }
  };

  const handleClose = () => {
    setHasError(false);
    setIsLoading(false);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "30px",
        flexDirection: "column",
      }}
    >
      <ErrorModal hasError={hasError} handleClose={handleClose} />

      {isLoading && <CircularProgress />}
      <ToggleButtonGroup
        color="primary"
        value={fileType}
        exclusive
        onChange={handleToggleChange}
        style={{ flexBasis: "100%" }}
      >
        <ToggleButton value="json2csv">Json2csv</ToggleButton>
        <ToggleButton value="csv2json">Csv2json</ToggleButton>
      </ToggleButtonGroup>

      <input type="file" onChange={onFileChanged} title={"File upload selector"}/>
      <Button variant="contained" onClick={onFileUpload}>
        Convert
      </Button>
    </div>
  );
};

export default Upload;
