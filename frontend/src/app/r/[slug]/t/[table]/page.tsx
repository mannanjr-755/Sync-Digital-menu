import { redirect, notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string; table: string }>;
};

/** NFC/QR entry — preserve table context and open the Sync digital menu home. */
export default async function TableMenuPage({ params }: Props) {
  const { table } = await params;
  const tableNumber = Number(table);

  if (!Number.isInteger(tableNumber) || tableNumber < 1) {
    notFound();
  }

  redirect(`/?table=${tableNumber}`);
}
