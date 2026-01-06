"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import styles from "./auth.module.css";

export default function RegistrationForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, code }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch (error: any) {
      alert(error.message || "Registration failed");
    }
  };

  return (
    <form className={styles.card} onSubmit={handleRegister}>
      <h2 className={styles.title}>Register</h2>

      <input
        type="email"
        placeholder="Email"
        className={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Registration Code"
        className={styles.input}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />

      <button className={styles.button} type="submit">
        Register
      </button>
    </form>
  );
}
