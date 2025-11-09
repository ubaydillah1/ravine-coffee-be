export const appendRandomToEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  const random = Math.random().toString(36).substring(2, 6);
  return `${local}_${random}@${domain}`;
};
