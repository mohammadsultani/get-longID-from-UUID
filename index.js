const axios = require("axios");
const querystring = require("querystring");
const fs = require("fs");

let ACCESS_TOKEN = "";

const checkSubmissions = async () => {
  console.log("Program Started Running ...");
  try {
    const postData = querystring.stringify({
      client_id: "c28efaa7-6feb-4eb0-87d2-b6255e2eaf8d",
      client_secret: "fb534870-6e4f-4a53-b5ac-d920874318c6",
      grant_type: "client_credentials",
      scope: "InvoicingAPI",
    });
    const response = await axios.post(
      "https://preprod-api.myinvois.hasil.gov.my/connect/token",
      postData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    ACCESS_TOKEN = response.data.access_token;

    const submissionIDs = fs.readFileSync("./SUUID.txt", "utf8");
    let content = "";
    for (const id of submissionIDs.split("\n")) {
      const uuid = id.trim();
      if (!uuid) continue;
      content += uuid;
      const longId = await getLongID(uuid);
      content += "\t" + longId + "\n";
    }
    fs.writeFileSync("LUUID.TXT", content, "utf8");
    // const longId = await checkSubmission("B5RGF6GTRNV5WCTP1RV9X8VJ10");
  } catch (error) {
    console.log("Something went wrong");
  } finally {
    console.log("Program Completed.");
  }
};

const getLongID = async (uuid, isRaw = false) => {
  try {
    if (!uuid) return;
    const response = await axios.get(
      `https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documents/${uuid}/${
        isRaw ? "raw" : "details"
      }`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data?.longId;
  } catch (error) {
    // console.log(JSON.stringify(error, null, 2));
    console.log("Request failed");
  }
};

// getLongID("687ZTBN6Z1N0SHB3GSCVHW1K10");

checkSubmissions();
