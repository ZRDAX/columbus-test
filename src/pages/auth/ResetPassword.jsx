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
  const accessToken = searchParams.get("access_token"); // Obtém o token do Supabase
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
    setTimeout(() => navigate("/signin"), 2000); // Redireciona após 2s
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold">Redefinir Senha</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
        <input 
          {...register("password", { required: "Senha obrigatória", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} 
          type="password" 
          placeholder="Nova Senha" 
          className="border p-2 rounded"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

        <input 
          {...register("confirmPassword", { required: "Confirme sua senha", validate: value => value === password || "Senhas não coincidem" })} 
          type="password" 
          placeholder="Confirmar Senha" 
          className="border p-2 rounded"
        />
        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}

        {errorMessage && <span className="text-red-500">{errorMessage}</span>}
        {successMessage && <span className="text-green-500">{successMessage}</span>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Redefinir Senha</button>
      </form>
    </div>
  );
};

export default ResetPassword;
