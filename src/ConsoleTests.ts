const ConsoleTests = (data: number[][], scan: number | null) => {
  let status = "";
  if (scan === 1) {
    console.log("Number of output columns = ", data[0].length);

    status = data.length === 41 ? "(Passed)" : "(Failed)";
    console.log("Dimension test: data length =", data.length, status);

    status = data[19][0] === -90.1 ? "(Passed)" : "(Failed)";
    console.log("Chi value: data[19][0] =", data[19][0], status);

    status = data[19][1] === 4990 ? "(Passed)" : "(Failed)";
    console.log("Detector value: data[19][1] =", data[19][1], status);
  }

  if (scan === 2) {
    console.log("Number of output columns = ", data[0].length);

    status = data.length === 201 ? "(Passed)" : "(Failed)";
    console.log("Dimension test: data length =", data.length, status);

    status = data[99][0] === 21.5318 ? "(Passed)" : "(Failed)";
    console.log("Theta value: data[99][0] =", data[99][0], status);

    status = data[99][1] === 76216 ? "(Passed)" : "(Failed)";
    console.log("Detector value: data[99][1] =", data[99][1], status);
  }

  if (scan === 3) {
    console.log("Number of output columns = ", data[0].length);

    status = data.length === 1681 ? "(Passed)" : "(Failed)";
    console.log("Dimension test: data length =", data.length, status);

    status = data[839][0] === -1.003 ? "(Passed)" : "(Failed)";
    console.log("H value: data[839][0] =", data[839][0], status);

    status = data[839][1] === 2.85 ? "(Passed)" : "(Failed)";
    console.log("L value: data[839][1] =", data[839][1], status);

    status = data[839][2] === 39 ? "(Passed)" : "(Failed)";
    console.log("Detector value: data[839][1] =", data[839][2], status);
  }
};

export default ConsoleTests;
