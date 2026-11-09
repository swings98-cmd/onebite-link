"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const MIN_PASSWORD_LENGTH = 6;

export type SignUpResult = { error?: string };

function toKoreanMessage(code: string | undefined): string {
  switch (code) {
    case "user_already_exists":
    case "email_exists":
      return "이미 가입된 이메일이에요.";
    case "email_address_invalid":
    case "validation_failed":
      return "올바른 이메일 주소를 입력해주세요.";
    case "weak_password":
      return `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상으로 입력해주세요.`;
    case "signup_disabled":
      return "현재는 회원가입을 받지 않아요.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "요청이 너무 많아요. 잠시 후 다시 시도해주세요.";
    default:
      return "회원가입에 실패했어요. 잠시 후 다시 시도해주세요.";
  }
}

function toSignInMessage(code: string | undefined): string {
  switch (code) {
    case "invalid_credentials":
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    case "email_not_confirmed":
      return "이메일 인증이 완료되지 않았어요. 메일함을 확인해주세요.";
    case "validation_failed":
    case "email_address_invalid":
      return "올바른 이메일 주소를 입력해주세요.";
    case "over_request_rate_limit":
      return "요청이 너무 많아요. 잠시 후 다시 시도해주세요.";
    default:
      return "로그인에 실패했어요. 잠시 후 다시 시도해주세요.";
  }
}

export async function signUp(formData: FormData): Promise<SignUpResult> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const rawConfirm = formData.get("passwordConfirm");

  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";
  const passwordConfirm = typeof rawConfirm === "string" ? rawConfirm : "";

  if (!email || !password || !passwordConfirm) {
    return { error: "이메일과 비밀번호를 모두 입력해주세요." };
  }
  if (password !== passwordConfirm) {
    return { error: "비밀번호가 일치하지 않아요." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상으로 입력해주세요.`,
    };
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { error: toKoreanMessage(error.code) };
  }
  return {};
}

export type SignInResult = { error?: string };

export async function signIn(formData: FormData): Promise<SignInResult> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해주세요." };
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: toSignInMessage(error.code) };
  }
  return {};
}

export async function signOut(): Promise<void> {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/login");
}
