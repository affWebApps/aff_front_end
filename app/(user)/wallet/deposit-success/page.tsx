"use client";
import { useRouter } from "next/navigation";
import SuccessScreen from "../../../../components/SuccessScreen";

const WithdrawalAccountCreatedScreen = () => {
  const router = useRouter();

  return (
    <SuccessScreen
      title="Withdrawal Account Created"
      subtitle="Your withdrawal account has been successfully added."
      transactionDetails={[
        { label: "Bank Name", value: "United Bank of Africa" },
        { label: "Account Number", value: "0123456789" },
        { label: "Account Name", value: "John Doe" },
      ]}
      buttonText="Back to wallet"
      onButtonClick={() => router.push("/wallet")}
    />
  );
};

export default WithdrawalAccountCreatedScreen;
