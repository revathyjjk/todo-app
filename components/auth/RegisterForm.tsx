"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import styles from "./auth.module.css";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      alert("Registration successful. Please login.");
      router.push("/login");
    } catch (error: any) {
      alert(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={handleRegister}>
      <h2 className={styles.title}>Register</h2>

      <input
        type="text"
        placeholder="Name"
        className={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

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

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Register"}
      </button>

      <p className={styles.registerText}>
        Already have an account?{" "}
        <Link href="/login" className={styles.registerLink}>
          Login
        </Link>
      </p>
    </form>
  );
}
