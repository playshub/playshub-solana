import { client, projectAddress, userKeypair } from "./constants";

async function getProfiles() {
  const profiles = await client.findProfiles({
    projects: [projectAddress],
  });

  const profile = profiles.profile;
  console.log("Total profiles: ", profile.length);
}

getProfiles();
