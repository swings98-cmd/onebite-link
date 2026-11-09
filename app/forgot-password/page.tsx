import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <ForgotPasswordForm
      initialError={
        error === "expired"
          ? "링크가 만료되었거나 올바르지 않아요. 다시 요청해주세요."
          : undefined
      }
    />
  );
}
