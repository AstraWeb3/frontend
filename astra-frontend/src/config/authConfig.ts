import { UserManagerSettings } from "oidc-client-ts";

// OIDC configuration
export const oidcConfig: UserManagerSettings = {
  authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY as string,
  client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID as string,
  redirect_uri: `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/authentication/callback`,
  response_type: "code",
  scope: process.env.NEXT_PUBLIC_OIDC_SCOPE as string,
  post_logout_redirect_uri: `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/logout`,
};
