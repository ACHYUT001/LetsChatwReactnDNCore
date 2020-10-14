import { url } from "inspector";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { objectValues } from "react-toastify/dist/utils";
import { Header, Icon } from "semantic-ui-react";
import PhotoUploadWidget from "./PhotoUploadWidget";

interface IProps {
  setFiles: (files: object[]) => void;
}

const dropzoneStyles = {
  border: "dashed 3px ",
  borderColor: "#eee",
  borderRadius: "5px",
  paddingTop: "30px",
  textAlign: "center" as "center",
  height: "200px",
};

const dropzoneActive = {
  borderColor: "green",
};

const PhotoUploadWidgetDropZone: React.FC<IProps> = ({ setFiles }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setFiles(
      acceptedFiles.map((file: object) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={
        isDragActive ? { ...dropzoneStyles, ...dropzoneActive } : dropzoneStyles
      }
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop Image here" />
      {/* {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )} */}
    </div>
  );
};

export default PhotoUploadWidgetDropZone;
