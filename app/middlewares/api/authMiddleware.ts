const validate = (token: string | undefined): boolean => {
  if (!token) {
    return false;
  }

  return true;
};

export function authMiddleware(req: Request): { isValid: boolean } {
  const authorizationHeader = req.headers.get("authorization");
  const token = authorizationHeader
    ? authorizationHeader.split(" ")[1]
    : undefined;

  return { isValid: validate(token) };
}
