import { client, projectAddress, userKeypair } from "./constants";

async function getUserProfile() {
  const users = await client.findUsers({
    wallets: [userKeypair.publicKey.toString()],
  });

  console.log(users.user[0]);
  const user = users.user[0];

  if (!user) {
    console.log("User not found");
    return;
  }

  console.log("Found!", user);

  const profiles = await client.findProfiles({
    projects: [projectAddress],
    userIds: [user.id],
  });

  const profile = profiles.profile[0];

  console.log("Found!", profile);
}

getUserProfile();
