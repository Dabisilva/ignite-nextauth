import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = {
      email,
      password,
    };

    await signIn(data);
  }
  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(text) => setEmail(text.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="password"
        onChange={(text) => setPassword(text.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  );
}
