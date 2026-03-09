/** 계좌 타입 및 신랑/신부 측 계좌 데이터, 카카오페이/토스페이 딥링크 공용 */

export interface Account {
  name: string;
  bank: string;
  number: string;
}

export const groomAccounts: Account[] = [
  { name: "김성민", bank: "신한은행", number: "110-123-456789" },
  { name: "김철수", bank: "국민은행", number: "012-34-56789" },
];

export const brideAccounts: Account[] = [
  { name: "이지은", bank: "카카오뱅크", number: "3333-01-2345678" },
  { name: "이동국", bank: "우리은행", number: "1002-123-456789" },
];

export function getKakaoPayUrl(account: Account): string {
  const amount = "";
  return `kakaotalk://kakaopay/money/to/bank?bank_name=${encodeURIComponent(
    account.bank
  )}&account_number=${account.number}&amount=${amount}&memo=${encodeURIComponent(
    account.name
  )}`;
}

export function getTossPayUrl(account: Account): string {
  const amount = "";
  const accountNoClean = account.number.replace(/-/g, "");
  return `supertoss://send?bank=${encodeURIComponent(
    account.bank
  )}&accountNo=${accountNoClean}&amount=${amount}&memo=${encodeURIComponent(
    account.name
  )}`;
}

export function handleKakaoPay(account: Account): void {
  window.location.href = getKakaoPayUrl(account);
}

export function handleToss(account: Account): void {
  window.location.href = getTossPayUrl(account);
}
