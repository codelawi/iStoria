import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";

export const useAuth = () => {
  const [isAuthenticated, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const stringUserData = await AsyncStorage.getItem("user-data");
      const userData = stringUserData ? JSON.parse(stringUserData) : null;
      if (!userData) {
        generateRandomUser();
      } else {
        setUserData(userData);
        setAuth(true);
      }
    } catch (e) {
      console.log("Async storage error");
      setUserData(null);
      setAuth(false);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomString = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  };

  const generateRandomUser = async () => {
    const userData = {
      fullName: "iStoria-user",
      uId: generateRandomString(12),
    };

    const serverPayload = {
      full_name: userData.fullName,
      u_id: userData.uId,
    };

    try {
      const payload = JSON.stringify(userData);
      await AsyncStorage.setItem("user-data", payload);
      await uploadProfileToServer(serverPayload);
      toast.success("New profile created!", {
        description: payload,
      });
      setAuth(true);
      setUserData(userData);
    } catch (e) {
      console.log("Async storage error", e);
    }
  };

  const uploadProfileToServer = async (payload: any) => {
    const { data, error } = await supabase.from("users").insert(payload);

    if (error) {
      console.log("supabase error", error);
    }
  };

  const deleteAccount = async () => {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("u_id", userData.uId);

    if (error) {
      console.log("deleting account failed", error);
      return;
    }

    await AsyncStorage.removeItem("user-data");
    toast.success("Account deleted successfully");

    setAuth(false);
    setUserData(null);

    generateRandomUser();
  };

  return {
    isAuthenticated,
    deleteAccount,
    loading,
    userData,
  };
};
