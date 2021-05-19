import { useAuth } from "../contexts/AuthContext";
import { ValidateUserPermissions } from "../utils/validateUserPermissions";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidatePermissions = ValidateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidatePermissions;
}
