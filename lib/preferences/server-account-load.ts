/** Skip client refetch when persisted account matches what the server already loaded. */
export function shouldSkipServerMatchedAccountLoad(
  accountId: string,
  serverSelectedAccountId: string,
) {
  return accountId === serverSelectedAccountId;
}
