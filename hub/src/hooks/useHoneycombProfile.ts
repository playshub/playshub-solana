import { honeycombClient } from "@/core/honeycomb-client";
import { useEffect, useState } from "react";
import useHoneycombUser from "./useHoneycombUser";
import { HONEYCOMB_PROJECT_ADDRESS } from "@/utils/constants";
import { FindProfilesQuery } from "@honeycomb-protocol/edge-client";

export default function useHoneycombProfile() {
  const user = useHoneycombUser();
  const [profile, setProfile] = useState<
    null | FindProfilesQuery["profile"][0]
  >(null);

  useEffect(() => {
    (async () => {
      if (user) {
        const profiles = await honeycombClient.findProfiles({
          userIds: [user?.id],
          projects: [HONEYCOMB_PROJECT_ADDRESS],
        });

        setProfile(profiles.profile[0]);
      }
    })();
  }, [user]);

  return profile;
}
