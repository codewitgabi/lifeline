import { useState, type FormEvent } from "react";
import { Loader } from "lucide-react";
import type { Donor } from "@lifeline/shared";
import { api } from "../../lib/api";

const baseInput: React.CSSProperties = { border: "1.5px solid #EBD9DC", color: "#231518", background: "#fff" };
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "#C8102E");
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = "#EBD9DC");

interface ReturnFormProps {
  onSuccess: (donor: Donor, token: string) => void;
  onSwitchToRegister: () => void;
}

function ReturnForm({ onSuccess, onSwitchToRegister }: ReturnFormProps) {
  const [phone, setPhone] = useState("");
  const [returning, setReturning] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setReturning(true);
    try {
      const { donor, token } = await api.post<{ donor: Donor; token: string }>("/api/donors/lookup", { phone });
      onSuccess(donor, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not find your account.");
    } finally {
      setReturning(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[18px] p-6.5 space-y-5" style={{ border: "1px solid #EBD9DC" }}>
      <div
        className="rounded-xl px-4 py-3.5 text-[13.5px]"
        style={{ background: "#FBF8F6", border: "1px solid #EBD9DC", color: "#6E5A5E" }}
      >
        Enter the phone number you registered with and we'll restore your donor account instantly.
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#231518" }}>Phone Number</label>
        <input
          type="tel"
          required
          autoFocus
          placeholder="+234 800 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-all"
          style={baseInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {error && (
        <div
          className="rounded-[10px] px-4 py-3 text-sm font-medium"
          style={{ background: "#F7E9EB", border: "1px solid #EBD9DC", color: "#C8102E" }}
        >
          {error}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="block mt-1 font-semibold underline underline-offset-2 text-[12px]"
            style={{ color: "#C8102E" }}
          >
            Register a new account instead
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={returning}
        className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-px active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "#C8102E", boxShadow: "0 1px 0 #9E0C24" }}
      >
        {returning ? (
          <span className="flex items-center justify-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Looking up account…
          </span>
        ) : (
          "Sign in"
        )}
      </button>

      <p className="text-center font-mono text-[11.5px]" style={{ color: "#6E5A5E" }}>
        New here?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold underline underline-offset-2"
          style={{ color: "#C8102E" }}
        >
          Create your donor account
        </button>
      </p>
    </form>
  );
}

export default ReturnForm;
