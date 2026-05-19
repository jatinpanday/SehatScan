import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { logout, setBootstrapped } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/userSlice";

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.me,
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (!token) {
      dispatch(setUser(null));
      dispatch(setBootstrapped(true));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (query.data) {
      dispatch(setUser(query.data));
      dispatch(setBootstrapped(true));
    }
  }, [dispatch, query.data]);

  useEffect(() => {
    if (query.isError) {
      dispatch(logout());
      dispatch(setUser(null));
      dispatch(setBootstrapped(true));
    }
  }, [dispatch, query.isError]);
}
