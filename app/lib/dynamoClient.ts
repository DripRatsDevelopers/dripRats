import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const db = DynamoDBDocumentClient.from(client);

export function apiResponse({
  success,
  data = null,
  error = null,
  status = 200,
}: {
  success: boolean;
  data?: Record<string, unknown> | null;
  error?: string | null;
  status?: number;
}) {
  return {
    status,
    body: { success: success ?? false, data, error },
  };
}

export const getUserItem = async ({ UserId }: { UserId: string }) => {
  const command = new GetCommand({
    TableName: "Users",
    Key: {
      UserId,
    },
  });

  const res = await db.send(command);
  return res.Item ? res.Item : null;
};
