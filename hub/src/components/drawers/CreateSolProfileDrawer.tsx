import { Button, Drawer, Flex, Image, Space, Typography } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQuestStatus } from "../../apis/quest/get-quest-status";
import { checkQuest } from "../../apis/quest/check-quest";
import { proceedQuest } from "../../apis/quest/proceed-quest";
import { useNotification } from "../providers/NotificationProvider";
import { useEffect, useState } from "react";
import useHoneycombProfile from "@/hooks/useHoneycombProfile";
import { adminKeypair, honeycombClient } from "@/core/honeycomb-client";
import { useSolWallet } from "../providers/SolanaWalletProvider";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import { HONEYCOMB_PROJECT_ADDRESS } from "@/utils/constants";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { getProfile } from "@/apis/account/profile";

export interface CreateSolProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSolProfileDrawer({
  open,
  onClose,
}: CreateSolProfileDrawerProps) {
  const [loading, setLoading] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const checkQuestMutation = useMutation({
    mutationFn: () => checkQuest("TASK", "CREATE_SOL_PROFILE"),
  });
  const proceedQuestMutation = useMutation({
    mutationFn: () => proceedQuest("TASK", "CREATE_SOL_PROFILE"),
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const task = data?.find((item) => item.requestType === "CREATE_SOL_PROFILE");
  const earn = task?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0;

  const profile = useHoneycombProfile();
  const { wallet } = useSolWallet();

  const create = async () => {
    if (!wallet) {
      notification.error("You have create sol wallet");
      return;
    }
    const userPublicKey = new PublicKey(wallet?.publicKey).toString();

    if (profile) {
      notification.info("You have created the profile");
      return;
    }

    await proceedQuestMutation.mutateAsync();

    // Implement the logic to create a Sol profile
    try {
      setLoading(true);
      // Create user
      const {
        createNewUserWithProfileTransaction: txResponse, // This is the transaction response, you'll need to sign and send this transaction
      } = await honeycombClient.createNewUserWithProfileTransaction({
        wallet: userPublicKey,
        payer: adminKeypair.publicKey.toString(),
        project: HONEYCOMB_PROJECT_ADDRESS,
        profileIdentity: userPublicKey,
        userInfo: {
          name: "John Doe",
          bio: "This user is created for testing purposes",
          pfp: "https://lh3.googleusercontent.com/-Jsm7S8BHy4nOzrw2f5AryUgp9Fym2buUOkkxgNplGCddTkiKBXPLRytTMXBXwGcHuRr06EvJStmkHj-9JeTfmHsnT0prHg5Mhg",
        },
      });

      console.log("Sending transaction...");
      await sendTransactions(
        honeycombClient, // The client instance you created earlier in the setup
        {
          transactions: [txResponse.transaction], // If the transaction response contains only one transaction; in case of multiple transactions pass txResponse.transactions without the array brackets
          blockhash: txResponse.blockhash,
          lastValidBlockHeight: txResponse.lastValidBlockHeight,
        },
        [adminKeypair]
      );
      setLoading(false);

      console.log("Create profile for user done!");

      await axios.post(
        "https://api-solana.playshub.io/honeycomb-profile/reward",
        {
          userPublicKey,
          accountId: profileData?.account.accountId,
        }
      );

      notification.success(
        "Create profile successful. Please check to get reward"
      );
    } catch (error) {
      setLoading(false);
      notification.error("Failed to create profile");
    }
  };

  const notification = useNotification()!;
  useEffect(() => {
    if (checkQuestMutation.isSuccess) {
      notification.success("Claim Bonus Successful!");
      refetch();
      onClose();
    }
  }, [checkQuestMutation.isSuccess]);

  useEffect(() => {
    if (checkQuestMutation.isError) {
      if (checkQuestMutation.error.message === "You have claimed the quest") {
        notification.warning("You have claimed the quest");
      } else {
        notification.warning("You have not completed the quest");
      }
    }
  }, [checkQuestMutation.isError]);

  return (
    <Drawer open={open} footer={null} placement="bottom" onClose={onClose}>
      <Flex vertical align="center" gap={15}>
        <Flex vertical align="center">
          <div style={{ padding: 10 }}>
            <Image src="/icons/earn/honeycomb.png" preview={false} width={80} />
          </div>
          <Space>
            <Typography.Text style={{ color: "#01BEED" }}>
              {`+${earn}`}
            </Typography.Text>
            <Image
              src="/icons/play/$plays-coin.png"
              width={20}
              preview={false}
            />
          </Space>
        </Flex>
        <Flex vertical align="center">
          <Typography.Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Create Profile
          </Typography.Text>
          <Typography.Text>Create profile to get reward</Typography.Text>
        </Flex>
        <Flex vertical gap={10} style={{ width: "70%" }}>
          <Button
            type="primary"
            onClick={create}
            style={{ padding: 20 }}
            loading={loading}
          >
            Create
          </Button>
          <Button
            type="default"
            style={{ padding: 20 }}
            onClick={() => checkQuestMutation.mutate()}
          >
            Check
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  );
}
