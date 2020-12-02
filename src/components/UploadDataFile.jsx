import React from 'react';

function UploadDataFile() {
    const [file, setFile] = React.useState("");

    function HandleUpload(Event) {
        setFile(Event.target.files[0]);
    };

    return(
      <div> 
        <p>Upload your data file below:</p>
        <input type="file" onChange={HandleUpload} />
        <p>File name: {file.name}</p>
        <p>File size: {file.size} bytes.</p>
      </div>
    )
  }

export default UploadDataFile
