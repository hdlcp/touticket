// utils/PasswordCriteria.jsx
export function validatePassword(pwd) {
  if (pwd.length < 6)                                              return "Au moins 6 caractères requis";
  if (!/[A-Z]/.test(pwd))                                          return "Une majuscule requise";
  if (!/[a-z]/.test(pwd))                                          return "Une minuscule requise";
  if (!/[0-9]/.test(pwd))                                          return "Un chiffre requis";
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/]/.test(pwd))           return "Un caractère spécial requis";
  return null;
}

export function PasswordCriteria({ password }) {
  if (!password) return null;

  const criteria = [
    { test: password.length >= 6,                                              label: "Au moins 6 caractères"  },
    { test: /[A-Z]/.test(password),                                            label: "Une majuscule"          },
    { test: /[a-z]/.test(password),                                            label: "Une minuscule"          },
    { test: /[0-9]/.test(password),                                            label: "Un chiffre"             },
    { test: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/]/.test(password),             label: "Un caractère spécial"   },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map(({ test, label }) => (
        <p key={label} className={`text-[10px] flex items-center gap-1 ${test ? "text-green-500" : "text-gray-400"}`}>
          <span>{test ? "✓" : "○"}</span>
          {label}
        </p>
      ))}
    </div>
  );
}