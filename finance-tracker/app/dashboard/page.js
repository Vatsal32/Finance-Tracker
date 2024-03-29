"use client";
import Add from "@/components/add";
import Show from "@/components/show";
import Export from "@/components/export";
import Charts from "@/components/charts";
import {useState, useEffect, useMemo} from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  //   dashboard page to a financial tracker app using tailwindcss with option to add delete and update the finances

  // a react form component using tightwindcss
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      // Session data is still loading
      return;
    }

    if (!session) {
      // User is not logged in, redirect to homepage
      router.push("/");
    }
  }, [status, session, router]);

  const data1 = useMemo(() => {
    const d = [];

    for (let k of Object.keys(data)) {
      d.push({
        expense_id: k,
        ...data[k],
      });
    }

    d.sort((a, b) => {
      return new Date(b.expense_date) - new Date(a.expense_date);
    });

    return d;
  }, [data]);

  if (status === "loading") {
    // Display loading state
    return <p>Loading...</p>;
  }

  if (!session) {
    // User is not logged in, redirecting to homepage
    return null;
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Add data={data} set={(d) => setData(d)} />
      <Charts data={data1} />
      <Show data={data1} />
      <Export data={data1} />
    </QueryClientProvider>
  );
}
