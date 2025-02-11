import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "../../utils/supabaseClient";

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const password = watch("password");

  const onSubmit = async ({ password }) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!accessToken) {
      return setErrorMessage("Token inválido ou expirado.");
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return setErrorMessage(error.message);
    }

    setSuccessMessage("Senha redefinida com sucesso!");
    setTimeout(() => navigate("/signin"), 2000);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-my-bg bg-cover">
      <div className="bg-white rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white dark:text-gray-100 text-center mb-4">
          Redefinir Senha
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("password", { required: "Senha obrigatória", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
              type="password"
              placeholder="Nova Senha"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <input
              {...register("confirmPassword", { required: "Confirme sua senha", validate: value => value === password || "Senhas não coincidem" })}
              type="password"
              placeholder="Confirmar Senha"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-white hover:bg-slate-300 text-[#008171] py-2 rounded-md font-semibold transition dark:bg-gray-200 dark:hover:bg-gray-400"
          >
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
