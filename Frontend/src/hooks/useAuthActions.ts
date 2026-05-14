import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { queryClient } from "@/api/queryClient";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { setLanguage } from "@/store/languageSlice";
import { setUser } from "@/store/userSlice";

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ token, user }) => {
      queryClient.clear();
      dispatch(setCredentials({ token }));
      dispatch(setUser(user));
      dispatch(setLanguage(user.preferredLanguage));
      toast.success("Logged in successfully");
      navigate(ROUTES.dashboard, { replace: true });
    },
  });
}

export function useSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (_, variables) => {
      toast.success("Account created");
      navigate(`${ROUTES.verifyOtp}?email=${encodeURIComponent(variables.email)}`);
    },
  });
}
