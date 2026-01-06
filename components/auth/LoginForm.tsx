"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import styles from "./auth.module.css";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch (error: any) {
      alert(error.message || "Login failed");
    }
  };

  return (
    <form className={styles.card} onSubmit={handleLogin}>
      <h2 className={styles.title}>Login</h2>

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

      <button className={styles.button} type="submit">
        Login
      </button>

      <p className={styles.registerText}>
        Don&apos;t have an account?{" "}
        <Link href="/register" className={styles.registerLink}>
          Register
        </Link>
      </p>
    </form>
  );
}
